require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const os = require('os');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pvg_mock_test_secret_2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'pvgadmin2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// ========== AUTH ==========

app.post('/api/auth/register', async (req, res) => {
    const { full_name, email, password, role, class: userClass, branch, admin_secret } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });
    if (role === 'admin') {
        if (!admin_secret || admin_secret !== ADMIN_SECRET) {
            return res.status(403).json({ error: 'Invalid admin secret key. Contact administrator.' });
        }
    }
    if (role === 'student' && (!userClass || !branch)) {
        return res.status(400).json({ error: 'Class and Branch are required for students' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users (full_name, email, password, role, class, branch) VALUES (?, ?, ?, ?, ?, ?)`,
            [full_name, email, hashedPassword, role || 'student', userClass || null, branch || null],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already registered' });
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'Registration successful', userId: this.lastID });
            }
        );
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid email or password' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, full_name: user.full_name, branch: user.branch, class: user.class }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, branch: user.branch, class: user.class } });
    });
});

// ========== ADMIN: TESTS ==========

app.post('/api/admin/tests', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { title, description, duration, eligibility_rules, result_display, scheduled_date, scheduled_time } = req.body;
    db.run(
        `INSERT INTO tests (title, description, duration, eligibility_rules, result_display, scheduled_date, scheduled_time) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, duration, JSON.stringify(eligibility_rules || {}), result_display || 'immediate', scheduled_date || null, scheduled_time || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Test created', testId: this.lastID });
        }
    );
});

app.get('/api/admin/tests', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.all(`SELECT * FROM tests ORDER BY created_at DESC`, [], (err, tests) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(tests || []);
    });
});

app.put('/api/admin/tests/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { title, description, duration, eligibility_rules, result_display, scheduled_date, scheduled_time, is_active } = req.body;
    db.run(
        `UPDATE tests SET title=?, description=?, duration=?, eligibility_rules=?, result_display=?, scheduled_date=?, scheduled_time=?, is_active=? WHERE id=?`,
        [title, description, duration, JSON.stringify(eligibility_rules || {}), result_display, scheduled_date, scheduled_time, is_active !== undefined ? is_active : 1, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Test updated' });
        }
    );
});

app.delete('/api/admin/tests/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.run(`DELETE FROM tests WHERE id=?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.run(`DELETE FROM questions WHERE test_id=?`, [req.params.id]);
        db.run(`DELETE FROM sections WHERE test_id=?`, [req.params.id]);
        res.json({ message: 'Test deleted' });
    });
});

app.get('/api/admin/tests/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.get(`SELECT * FROM tests WHERE id=?`, [req.params.id], (err, test) => {
        if (err || !test) return res.status(404).json({ error: 'Test not found' });
        db.all(`SELECT * FROM questions WHERE test_id=? ORDER BY id`, [req.params.id], (err2, questions) => {
            db.all(`SELECT * FROM sections WHERE test_id=? ORDER BY id`, [req.params.id], (err3, sections) => {
                res.json({ ...test, questions: questions || [], sections: sections || [] });
            });
        });
    });
});

// ========== ADMIN: SECTIONS & QUESTIONS ==========

app.post('/api/admin/sections', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { test_id, title, duration_limit } = req.body;
    db.run(`INSERT INTO sections (test_id, title, duration_limit) VALUES (?, ?, ?)`, [test_id, title, duration_limit], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ sectionId: this.lastID });
    });
});

app.post('/api/admin/questions', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { test_id, section_id, type, question_text, image_url, options, correct_answer, explanation, marks } = req.body;
    db.run(
        `INSERT INTO questions (test_id, section_id, type, question_text, image_url, options, correct_answer, explanation, marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [test_id, section_id, type, question_text, image_url, JSON.stringify(options), correct_answer, explanation, marks || 1],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ questionId: this.lastID });
        }
    );
});

app.put('/api/admin/questions/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { type, question_text, image_url, options, correct_answer, explanation, marks } = req.body;
    db.run(`UPDATE questions SET type=?, question_text=?, image_url=?, options=?, correct_answer=?, explanation=?, marks=? WHERE id=?`,
        [type, question_text, image_url, JSON.stringify(options), correct_answer, explanation, marks, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Question updated' });
        }
    );
});

app.delete('/api/admin/questions/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.run(`DELETE FROM questions WHERE id=?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Question deleted' });
    });
});

// ========== ADMIN: RESULTS ==========

app.get('/api/admin/tests/:id/results', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.all(`
        SELECT ta.id as attempt_id, ta.score, ta.status, ta.start_time, ta.end_time,
               u.full_name, u.email, u.branch, u.class,
               (SELECT COUNT(*) FROM questions WHERE test_id = ta.test_id) as total_questions,
               (SELECT SUM(marks) FROM questions WHERE test_id = ta.test_id) as total_marks
        FROM test_attempts ta
        JOIN users u ON ta.user_id = u.id
        WHERE ta.test_id = ? ORDER BY ta.score DESC
    `, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results || []);
    });
});

app.get('/api/admin/tests/:id/results/excel', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.get(`SELECT title FROM tests WHERE id=?`, [req.params.id], (err, test) => {
        if (!test) return res.status(404).json({ error: 'Test not found' });
        db.all(`
            SELECT ta.score, ta.status, ta.start_time, ta.end_time,
                   u.full_name, u.email, u.branch, u.class,
                   (SELECT SUM(marks) FROM questions WHERE test_id = ta.test_id) as total_marks
            FROM test_attempts ta JOIN users u ON ta.user_id = u.id
            WHERE ta.test_id = ? ORDER BY ta.score DESC
        `, [req.params.id], async (err2, results) => {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Results');
            sheet.columns = [
                { header: 'Sr No', key: 'sr', width: 8 },
                { header: 'Student Name', key: 'name', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Class', key: 'class', width: 10 },
                { header: 'Branch', key: 'branch', width: 12 },
                { header: 'Score', key: 'score', width: 10 },
                { header: 'Total Marks', key: 'total', width: 12 },
                { header: 'Status', key: 'status', width: 12 },
                { header: 'Date', key: 'date', width: 20 },
            ];
            // Style header row
            sheet.getRow(1).font = { bold: true };
            (results || []).forEach((r, i) => {
                sheet.addRow({ sr: i + 1, name: r.full_name, email: r.email, class: r.class, branch: r.branch, score: r.score || 0, total: r.total_marks || 0, status: r.status, date: r.start_time });
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${test.title}_results.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        });
    });
});

app.get('/api/admin/tests/:id/results/pdf', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.get(`SELECT title FROM tests WHERE id=?`, [req.params.id], (err, test) => {
        if (!test) return res.status(404).json({ error: 'Test not found' });
        db.all(`
            SELECT ta.score, u.full_name, u.email, u.branch, u.class,
                   (SELECT SUM(marks) FROM questions WHERE test_id = ta.test_id) as total_marks
            FROM test_attempts ta JOIN users u ON ta.user_id = u.id
            WHERE ta.test_id = ? AND ta.status='completed' ORDER BY ta.score DESC
        `, [req.params.id], (err2, results) => {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${test.title}_results.pdf`);
            doc.pipe(res);
            doc.fontSize(16).font('Helvetica-Bold').text("Pune Vidyarthi Griha's College of Engineering", { align: 'center' });
            doc.fontSize(10).font('Helvetica').text("& S. S. Dhamankar Institute of Management, Nashik | NAAC 'A' Grade", { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Test Results: ' + test.title, { align: 'center' });
            doc.moveDown();
            // Table header
            const cols = [40, 70, 210, 260, 320, 380];
            let y = doc.y;
            doc.fontSize(9).font('Helvetica-Bold');
            doc.text('Sr No', cols[0], y); doc.text('Student Name', cols[1], y); doc.text('Class', cols[2], y);
            doc.text('Branch', cols[3], y); doc.text('Score', cols[4], y); doc.text('Total', cols[5], y);
            y += 16;
            doc.moveTo(40, y).lineTo(430, y).stroke(); y += 5;
            doc.font('Helvetica').fontSize(9);
            (results || []).forEach((r, i) => {
                if (y > 750) { doc.addPage(); y = 50; }
                doc.text(String(i + 1), cols[0], y); doc.text(r.full_name || '', cols[1], y);
                doc.text(r.class || '', cols[2], y); doc.text(r.branch || '', cols[3], y);
                doc.text(String(r.score || 0), cols[4], y); doc.text(String(r.total_marks || 0), cols[5], y);
                y += 16;
            });
            doc.end();
        });
    });
});

// ========== EMAIL (Gmail SMTP) ==========

app.post('/api/admin/send-email', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { to, subject, body } = req.body;
    if (!to || !to.trim()) return res.status(400).json({ error: 'Recipient email(s) required' });

    try {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass || emailUser.includes('your_')) {
            return res.status(400).json({
                error: 'Email not configured yet. Please update EMAIL_USER and EMAIL_PASS in backend/.env file with your Gmail ID and App Password. Steps: 1) Go to myaccount.google.com/apppasswords 2) Generate App Password 3) Put it in .env'
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: emailUser, pass: emailPass },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // Verify connection first
        await transporter.verify();

        const emails = to.split(',').map(e => e.trim()).filter(e => e);
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || emailUser,
            to: emails.join(', '),
            subject: subject || 'Mock Test Notification',
            html: body || '<h2>New Mock Test Available</h2><p>Please login to the Mock Test Platform to take the test.</p>',
        });
        res.json({ message: 'Email sent successfully to ' + emails.length + ' recipient(s)!' });
    } catch (err) {
        res.status(500).json({ error: 'Email failed: ' + err.message });
    }
});

// ========== STUDENT ROUTES ==========

app.get('/api/student/tests', authenticateToken, (req, res) => {
    const { branch } = req.user;
    db.all(`SELECT * FROM tests WHERE is_active = 1`, [], (err, tests) => {
        if (err) return res.status(500).json({ error: err.message });
        const now = new Date();
        const eligibleTests = (tests || []).filter(test => {
            if (!test.eligibility_rules) return true;
            try {
                const rules = JSON.parse(test.eligibility_rules);
                if (rules.branches && rules.branches.length > 0 && !rules.branches.includes(branch)) return false;
                return true;
            } catch (e) { return true; }
        }).map(test => {
            let isUpcoming = false;
            if (test.scheduled_date) {
                const testDateTime = new Date(test.scheduled_date + 'T' + (test.scheduled_time || '00:00'));
                isUpcoming = testDateTime > now;
            }
            return { ...test, is_upcoming: isUpcoming };
        });
        res.json(eligibleTests);
    });
});

app.get('/api/student/tests/:test_id/questions', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM questions WHERE test_id = ? ORDER BY id`, [req.params.test_id], (err, questions) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(questions || []);
    });
});

app.post('/api/student/attempts/:test_id/start', authenticateToken, (req, res) => {
    const testId = req.params.test_id;
    const userId = req.user.id;
    db.get(`SELECT * FROM tests WHERE id = ?`, [testId], (err, test) => {
        if (err || !test) return res.status(404).json({ error: 'Test not found' });
        if (test.scheduled_date) {
            const testDateTime = new Date(test.scheduled_date + 'T' + (test.scheduled_time || '00:00'));
            if (testDateTime > new Date()) {
                return res.status(400).json({ error: 'Test not yet available. Scheduled for ' + test.scheduled_date });
            }
        }
        db.get(`SELECT * FROM test_attempts WHERE test_id = ? AND user_id = ?`, [testId, userId], (err2, attempt) => {
            if (attempt) {
                if (attempt.status === 'completed') return res.status(400).json({ error: 'Test already completed' });
                return res.json({ message: 'Resuming test', attempt, timeRemaining: attempt.time_remaining });
            }
            const timeRemaining = test.duration * 60;
            db.run(`INSERT INTO test_attempts (test_id, user_id, time_remaining) VALUES (?, ?, ?)`,
                [testId, userId, timeRemaining], function (err3) {
                    if (err3) return res.status(500).json({ error: err3.message });
                    res.status(201).json({ message: 'Test started', attemptId: this.lastID, timeRemaining });
                }
            );
        });
    });
});

app.post('/api/student/attempts/:attempt_id/save', authenticateToken, (req, res) => {
    const { answers, time_remaining } = req.body;
    db.serialize(() => {
        db.run(`UPDATE test_attempts SET time_remaining = ? WHERE id = ?`, [time_remaining, req.params.attempt_id]);
        if (answers && answers.length > 0) {
            const stmt = db.prepare(`INSERT OR REPLACE INTO answers (id, attempt_id, question_id, submitted_answer) 
                VALUES ((SELECT id FROM answers WHERE attempt_id = ? AND question_id = ?), ?, ?, ?)`);
            answers.forEach(ans => { stmt.run([req.params.attempt_id, ans.question_id, req.params.attempt_id, ans.question_id, ans.submitted_answer]); });
            stmt.finalize();
        }
        res.json({ message: 'Progress saved' });
    });
});

app.get('/api/student/attempts/:attempt_id/answers', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM answers WHERE attempt_id = ?`, [req.params.attempt_id], (err, answers) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(answers || []);
    });
});

app.post('/api/student/attempts/:attempt_id/submit', authenticateToken, (req, res) => {
    const attemptId = req.params.attempt_id;
    const { answers } = req.body;
    db.get(`SELECT ta.*, t.title FROM test_attempts ta JOIN tests t ON ta.test_id = t.id WHERE ta.id = ?`, [attemptId], (err, attempt) => {
        if (err || !attempt) return res.status(404).json({ error: 'Attempt not found' });
        db.serialize(() => {
            if (answers && answers.length > 0) {
                const stmt = db.prepare(`INSERT OR REPLACE INTO answers (id, attempt_id, question_id, submitted_answer) 
                    VALUES ((SELECT id FROM answers WHERE attempt_id = ? AND question_id = ?), ?, ?, ?)`);
                answers.forEach(ans => { stmt.run([attemptId, ans.question_id, attemptId, ans.question_id, ans.submitted_answer]); });
                stmt.finalize();
            }
            db.all(`SELECT * FROM questions WHERE test_id = ?`, [attempt.test_id], (err2, questions) => {
                let score = 0, total = 0;
                (questions || []).forEach(q => {
                    total += q.marks || 1;
                    if (q.type === 'mcq' && answers) {
                        const ua = answers.find(a => a.question_id === q.id);
                        if (ua && ua.submitted_answer === q.correct_answer) score += q.marks || 1;
                    }
                });
                db.run(`UPDATE test_attempts SET status='completed', end_time=CURRENT_TIMESTAMP, score=?, time_remaining=0 WHERE id=?`, [score, attemptId]);
                if (answers) {
                    answers.forEach(ans => {
                        const q = (questions || []).find(qq => qq.id === ans.question_id);
                        if (q && q.type === 'mcq') {
                            const correct = ans.submitted_answer === q.correct_answer;
                            db.run(`UPDATE answers SET is_correct=?, marks_awarded=? WHERE attempt_id=? AND question_id=?`,
                                [correct ? 1 : 0, correct ? (q.marks || 1) : 0, attemptId, ans.question_id]);
                        }
                    });
                }
                res.json({ score, total, message: 'Test submitted successfully' });
            });
        });
    });
});

app.get('/api/student/results', authenticateToken, (req, res) => {
    db.all(`
        SELECT ta.*, t.title, t.result_display,
               (SELECT SUM(marks) FROM questions WHERE test_id = ta.test_id) as total_marks
        FROM test_attempts ta JOIN tests t ON ta.test_id = t.id 
        WHERE ta.user_id = ? AND ta.status = 'completed' ORDER BY ta.end_time DESC
    `, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results || []);
    });
});

app.get('/api/student/results/:attempt_id/pdf', authenticateToken, (req, res) => {
    db.get(`
        SELECT ta.*, t.title, u.full_name, u.branch, u.class 
        FROM test_attempts ta JOIN tests t ON ta.test_id = t.id JOIN users u ON ta.user_id = u.id
        WHERE ta.id = ? AND ta.user_id = ?`, [req.params.attempt_id, req.user.id], (err, attempt) => {
        if (err || !attempt) return res.status(404).json({ error: 'Result not found' });
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=result_' + req.params.attempt_id + '.pdf');
        doc.pipe(res);
        doc.fontSize(18).font('Helvetica-Bold').text("Pune Vidyarthi Griha's College of Engineering", { align: 'center' });
        doc.fontSize(11).font('Helvetica').text("& S. S. Dhamankar Institute of Management, Nashik", { align: 'center' });
        doc.fontSize(10).text("NAAC 'A' Grade", { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold').text('Mock Test Result Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica');
        doc.text('Student: ' + attempt.full_name);
        doc.text('Class: ' + (attempt.class || 'N/A') + ' | Branch: ' + (attempt.branch || 'N/A'));
        doc.text('Test: ' + attempt.title);
        doc.text('Date: ' + new Date(attempt.end_time || attempt.start_time).toLocaleDateString());
        doc.moveDown();
        doc.fontSize(16).font('Helvetica-Bold').text('Score: ' + (attempt.score || 0));
        doc.end();
    });
});

// ========== LAN IP ==========
function getLanIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) return net.address;
        }
    }
    return 'localhost';
}

// ========== SERVE FRONTEND (Production) ==========
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        } else {
            next();
        }
    });
}

app.listen(PORT, '0.0.0.0', () => {
    const lanIP = getLanIP();
    console.log('\n======================================');
    console.log('  PVG Mock Test Platform - Backend');
    console.log('======================================');
    console.log('  Local:   http://localhost:' + PORT);
    console.log('  Network: http://' + lanIP + ':' + PORT);
    console.log('======================================');
    console.log('  Admin Secret: ' + ADMIN_SECRET);
    console.log('======================================\n');
});
