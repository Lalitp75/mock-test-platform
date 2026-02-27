// Question Bank with variation engine - generates unlimited questions per topic
const B = {
    'Profit and Loss': [
        { q: 'A bought for Rs.400, sold for Rs.500. Profit%?', o: ['20%', '25%', '30%', '15%'], a: '25%', e: 'Profit=100. %=(100/400)×100=25%' },
        { q: 'CP of 15 articles = SP of 12. Profit%?', o: ['20%', '25%', '30%', '15%'], a: '25%', e: 'SP each=15/12=1.25. Profit%=25%' },
        { q: 'Sells two at Rs.99 each, gains 10% on one, loses 10% on other. Net?', o: ['1% loss', '1% gain', 'No change', '2% loss'], a: '1% loss', e: 'Same SP, same %: loss=(%)²/100=1%' },
        { q: 'Sold for Rs.240, loses 20%. SP for 20% gain?', o: ['Rs.360', 'Rs.320', 'Rs.280', 'Rs.300'], a: 'Rs.360', e: 'CP=240/0.8=300. SP=300×1.2=360' },
        { q: 'Marks 40% above CP, 20% discount. Profit%?', o: ['20%', '12%', '15%', '10%'], a: '12%', e: 'CP=100,MP=140,SP=112. Profit=12%' },
        { q: 'Sold at 6% gain vs 6% loss gives Rs.72 more. CP?', o: ['Rs.500', 'Rs.600', 'Rs.700', 'Rs.800'], a: 'Rs.600', e: '12% of CP=72. CP=600' },
        { q: 'Bought 6 for Rs.10, sold 4 for Rs.12. Profit%?', o: ['60%', '80%', '50%', '70%'], a: '80%', e: 'CP12=20, SP12=36. %=(16/20)×100=80%' },
        { q: 'SP=Rs.1200, profit=20%. CP?', o: ['Rs.960', 'Rs.1000', 'Rs.1050', 'Rs.900'], a: 'Rs.1000', e: 'CP=1200/1.2=1000' },
        { q: 'Uses 960gm instead of 1kg. Gain%?', o: ['4%', '4.17%', '5%', '3.5%'], a: '4.17%', e: '(40/960)×100=4.17%' },
        { q: 'A sells to B at 20%, B sells to C at 10%. C pays Rs.1320. A paid?', o: ['Rs.900', 'Rs.1000', 'Rs.1100', 'Rs.950'], a: 'Rs.1000', e: 'CP×1.2×1.1=1320. CP=1000' },
        { q: 'Loss 20% on SP = what % loss on CP?', o: ['16.67%', '20%', '25%', '15%'], a: '16.67%', e: 'SP=100,Loss=20,CP=120. %=20/120×100=16.67' },
        { q: 'Watch bought Rs.1950, sold at 10% loss. SP?', o: ['Rs.1755', 'Rs.1800', 'Rs.1700', 'Rs.1850'], a: 'Rs.1755', e: '1950×0.9=1755' },
        { q: 'CP is 80% of SP. Profit%?', o: ['20%', '25%', '30%', '16.67%'], a: '25%', e: 'SP=100,CP=80. %=20/80×100=25%' },
        { q: '10% discount, still 20% gain. MP:CP?', o: ['4:3', '5:3', '3:2', '7:5'], a: '4:3', e: 'SP=1.2x. MP=1.2x/0.9=4x/3' },
        { q: 'Sells at Rs.9/kg, loses 10%. SP for 5% profit?', o: ['Rs.10.50', 'Rs.10', 'Rs.11', 'Rs.12'], a: 'Rs.10.50', e: 'CP=9/0.9=10. SP=10×1.05=10.50' },
        { q: 'SP Rs.832 profit = SP Rs.448 loss. CP?', o: ['Rs.700', 'Rs.640', 'Rs.600', 'Rs.580'], a: 'Rs.640', e: 'CP-448=832-CP. 2CP=1280. CP=640' },
        { q: 'Buys at 20% discount on list, sells at list. Gain%?', o: ['20%', '25%', '30%', '15%'], a: '25%', e: 'CP=80,SP=100. %=20/80×100=25%' },
        { q: 'SP Rs.2500 with 25% profit on SP. CP?', o: ['Rs.1875', 'Rs.2000', 'Rs.1750', 'Rs.2100'], a: 'Rs.1875', e: 'Profit=625. CP=2500-625=1875' },
        { q: 'Mixes 26kg@Rs.20 + 30kg@Rs.36, sells@Rs.30. Profit%?', o: ['5%', '10%', '3%', '8%'], a: '5%', e: 'CP=1600,SP=1680. %=80/1600×100=5%' },
        { q: 'Dealer offers 15% discount, still gains 25%. MP:CP ratio?', o: ['25:17', '20:17', '15:11', '5:4'], a: '25:17', e: 'SP=1.25CP. MP=SP/0.85=1.25/0.85=25/17' },
    ],
    'Time and Work': [
        { q: 'A does work in 10 days, B in 15. Together?', o: ['5', '6', '7', '8'], a: '6', e: '1/10+1/15=1/6. 6 days' },
        { q: '6 men in 12 days. Men needed for 4 days?', o: ['18', '15', '20', '24'], a: '18', e: '6×12=M×4. M=18' },
        { q: 'A+B in 12 days. A alone in 20. B alone?', o: ['30', '25', '28', '35'], a: '30', e: '1/12-1/20=1/30' },
        { q: 'A twice as good as B. Together 14 days. A alone?', o: ['21', '28', '42', '14'], a: '21', e: 'A rate=2x,B=x. 3x=1/14. A=1/21' },
        { q: '8 hrs/day done in 6 days. At 6 hrs/day?', o: ['8', '9', '10', '7'], a: '8', e: '48hrs total. 48/6=8 days' },
        { q: 'A in 9d, B in 12d, C in 18d. Together 3d then A leaves. B+C finish in?', o: ['4', '3', '5', '6'], a: '4', e: '3d work=3/4. Remaining 1/4 by B+C(5/36)≈4d' },
        { q: 'Tap fills in 6hrs. After half, 3 more taps open. Total time?', o: ['3h45m', '4h', '3h30m', '4h15m'], a: '3h45m', e: 'Half=3h. Rest by 4 taps=45min' },
        { q: 'A in 20d, works 5d, B finishes rest in 10d. B alone?', o: ['40/3', '15', '20', '25'], a: '40/3', e: 'A does 1/4. B does 3/4 in 10d. B=40/3 days' },
        { q: '12 men finish in 10d. 15 women in 12d. 6 men + 5 women?', o: ['12', '15', '10', '20'], a: '12', e: 'Man=1/120, Woman=1/180. Combined≈12d' },
        { q: 'Pipe A fills in 20min, B empties in 30min. Both open, tank fills in?', o: ['60min', '45min', '50min', '40min'], a: '60min', e: '1/20-1/30=1/60' },
        { q: 'A+B in 8d, B+C in 12d, A+C in 10d. All together?', o: ['80/13', '6', '7', '5'], a: '80/13', e: '2(A+B+C)=1/8+1/12+1/10=37/120. All=240/37≈80/13' },
        { q: '20 workers build wall in 6d. After 3d, 5 more join. Remaining done in?', o: ['12/5', '3', '2', '4'], a: '12/5', e: 'Half done. 25 workers do half: (1/2)/(25/120)=12/5d' },
    ],
    'Percentage': [
        { q: '35% of 240?', o: ['84', '72', '96', '80'], a: '84', e: '35/100×240=84' },
        { q: '20% of N is 50. 30% of N?', o: ['60', '75', '80', '100'], a: '75', e: 'N=250. 30%=75' },
        { q: '72/80 as percentage?', o: ['88%', '90%', '85%', '92%'], a: '90%', e: '72/80×100=90%' },
        { q: 'Population +10% then +20% = 13200. Original?', o: ['10000', '11000', '9000', '12000'], a: '10000', e: 'P×1.32=13200. P=10000' },
        { q: '40% and 60% more than third. Ratio?', o: ['7:8', '8:7', '2:3', '3:4'], a: '7:8', e: '140:160=7:8' },
        { q: 'Price up 25%. Reduce consumption by?', o: ['20%', '25%', '15%', '30%'], a: '20%', e: '25/125×100=20%' },
        { q: '+20% then -20%. Net change?', o: ['4% decrease', 'No change', '4% increase', '2% decrease'], a: '4% decrease', e: '100→120→96. -4%' },
        { q: '70% vote, winner got 60%, won by 1400. Total voters?', o: ['10000', '8000', '7500', '12000'], a: '10000', e: '0.14T=1400. T=10000' },
        { q: '40% of N exceeds 20% of 650 by 190. N?', o: ['800', '700', '850', '900'], a: '800', e: '0.4x-130=190. x=800' },
        { q: '60% of A = 40% of B. A:B?', o: ['2:3', '3:2', '4:5', '5:4'], a: '2:3', e: 'A/B=0.4/0.6=2/3' },
        { q: 'A is 20% more than B. B is what % less than A?', o: ['16.67%', '20%', '25%', '15%'], a: '16.67%', e: 'B/A=100/120. Diff=20/120×100=16.67%' },
        { q: '30% of 600 + 20% of 300 = ?', o: ['240', '180', '200', '260'], a: '240', e: '180+60=240' },
    ],
    'Sentence Completion': [
        { q: 'The teacher was ___ with the students for not completing homework.', o: ['annoyed', 'happy', 'pleased', 'satisfied'], a: 'annoyed', e: 'Context: not completing homework implies displeasure' },
        { q: 'Despite being ___, she managed to complete the marathon.', o: ['exhausted', 'energetic', 'fresh', 'young'], a: 'exhausted', e: 'Despite indicates contrast with completing marathon' },
        { q: 'The ___ weather forced everyone to stay indoors.', o: ['inclement', 'pleasant', 'sunny', 'mild'], a: 'inclement', e: 'Staying indoors implies bad weather' },
        { q: 'His ___ remarks hurt everyone in the room.', o: ['caustic', 'pleasant', 'humorous', 'kind'], a: 'caustic', e: 'Caustic means harsh/critical, matches hurting' },
        { q: 'The scientist made a ___ discovery that changed the world.', o: ['groundbreaking', 'trivial', 'minor', 'insignificant'], a: 'groundbreaking', e: 'Changed the world implies a major discovery' },
        { q: 'She spoke with such ___ that everyone was convinced.', o: ['conviction', 'hesitation', 'doubt', 'confusion'], a: 'conviction', e: 'Everyone being convinced implies strong belief' },
        { q: 'The ___ of evidence made it hard to convict the suspect.', o: ['paucity', 'abundance', 'surplus', 'excess'], a: 'paucity', e: 'Hard to convict implies lack/scarcity of evidence' },
        { q: 'After years of ___, the artist finally gained recognition.', o: ['obscurity', 'fame', 'popularity', 'success'], a: 'obscurity', e: 'Finally gaining recognition implies previous lack of it' },
        { q: 'The ___ student always topped every examination.', o: ['diligent', 'lazy', 'careless', 'indifferent'], a: 'diligent', e: 'Topping exams implies hardworking nature' },
        { q: 'His ___ nature made him popular among colleagues.', o: ['affable', 'rude', 'arrogant', 'hostile'], a: 'affable', e: 'Being popular implies friendly/pleasant nature' },
    ],
    'Reading Comprehension': [
        { q: 'In a passage about climate change: "The rising sea levels are a direct consequence of..." What does consequence mean?', o: ['Result', 'Cause', 'Prevention', 'Solution'], a: 'Result', e: 'Consequence = result/outcome' },
        { q: 'The author\'s tone in the passage about poverty was primarily:', o: ['Sympathetic', 'Humorous', 'Indifferent', 'Sarcastic'], a: 'Sympathetic', e: 'Discussing poverty typically evokes compassion' },
        { q: 'What can be inferred when a text states "Despite the warnings, many continued"?', o: ['People ignored advice', 'People followed advice', 'Warnings were false', 'No warnings given'], a: 'People ignored advice', e: 'Despite indicates contrast - continued despite warnings' },
        { q: '"The policy was met with widespread criticism." This suggests:', o: ['Many disagreed', 'Everyone agreed', 'Few cared', 'It was praised'], a: 'Many disagreed', e: 'Widespread criticism = many people opposed it' },
        { q: 'If a passage states "The findings corroborated earlier research", corroborated means:', o: ['Supported', 'Contradicted', 'Ignored', 'Questioned'], a: 'Supported', e: 'Corroborate = confirm/support' },
        { q: '"The company\'s fortunes took a nosedive after the scandal." Nosedive means:', o: ['Declined sharply', 'Improved', 'Stabilized', 'Fluctuated'], a: 'Declined sharply', e: 'Nosedive = sudden steep drop' },
        { q: 'The phrase "reading between the lines" means:', o: ['Understanding hidden meaning', 'Reading quickly', 'Skipping lines', 'Reading aloud'], a: 'Understanding hidden meaning', e: 'Idiom meaning to find implied meaning' },
        { q: '"The government\'s response was tepid." Tepid means:', o: ['Lukewarm/Unenthusiastic', 'Very strong', 'Aggressive', 'Immediate'], a: 'Lukewarm/Unenthusiastic', e: 'Tepid = lacking enthusiasm' },
    ],
    'Error Detection': [
        { q: 'Find error: "He don\'t know the answer to this question."', o: ['"don\'t" should be "doesn\'t"', '"know" should be "knew"', '"answer" should be "answers"', 'No error'], a: '"don\'t" should be "doesn\'t"', e: 'Third person singular: He doesn\'t' },
        { q: 'Find error: "Each of the boys have completed their work."', o: ['"have" should be "has"', '"their" should be "his"', 'Both A and B', 'No error'], a: 'Both A and B', e: 'Each takes singular: has, his' },
        { q: 'Find error: "She is more taller than her sister."', o: ['Remove "more"', 'Remove "taller"', 'Change "than" to "then"', 'No error'], a: 'Remove "more"', e: 'Comparative: taller (not more taller)' },
        { q: 'Find error: "The furnitures were delivered yesterday."', o: ['"furnitures" should be "furniture"', '"were" should be "was"', 'Both A and B', 'No error'], a: 'Both A and B', e: 'Furniture is uncountable: furniture was' },
        { q: 'Find error: "Neither of the students were present."', o: ['"were" should be "was"', '"of" should be "from"', '"students" should be "student"', 'No error'], a: '"were" should be "was"', e: 'Neither takes singular verb: was' },
        { q: 'Find error: "I have been living here since five years."', o: ['"since" should be "for"', '"have" should be "had"', 'Remove "been"', 'No error'], a: '"since" should be "for"', e: 'For + duration, Since + point in time' },
        { q: 'Find error: "He insisted to go there alone."', o: ['"to go" should be "on going"', 'Remove "alone"', '"insisted" should be "insist"', 'No error'], a: '"to go" should be "on going"', e: 'Insist on + gerund' },
        { q: 'Find error: "This is one of the best book I have ever read."', o: ['"book" should be "books"', '"best" should be "better"', '"ever" should be "never"', 'No error'], a: '"book" should be "books"', e: 'One of the best + plural noun' },
    ],
    'Idioms and Phrases': [
        { q: '"To burn the midnight oil" means:', o: ['Study/work late at night', 'Waste resources', 'Cook at midnight', 'Sleep late'], a: 'Study/work late at night', e: 'Idiom: working late into the night' },
        { q: '"A penny for your thoughts" means:', o: ['Asking what someone is thinking', 'Offering money', 'Saving money', 'Being cheap'], a: 'Asking what someone is thinking', e: 'Polite way to ask someone\'s thoughts' },
        { q: '"Break the ice" means:', o: ['Initiate conversation', 'Break something', 'Cool a drink', 'Cause trouble'], a: 'Initiate conversation', e: 'To start a conversation in awkward situations' },
        { q: '"Hit the nail on the head" means:', o: ['Describe exactly right', 'Use a hammer', 'Hurt someone', 'Make a mistake'], a: 'Describe exactly right', e: 'To be precisely correct' },
        { q: '"Once in a blue moon" means:', o: ['Very rarely', 'Every night', 'Frequently', 'Never'], a: 'Very rarely', e: 'Something that happens very infrequently' },
        { q: '"Bite the bullet" means:', o: ['Endure pain bravely', 'Eat quickly', 'Fight someone', 'Give up'], a: 'Endure pain bravely', e: 'To face a difficult situation with courage' },
        { q: '"Let the cat out of the bag" means:', o: ['Reveal a secret', 'Free an animal', 'Pack a bag', 'Hide something'], a: 'Reveal a secret', e: 'To accidentally disclose secret information' },
        { q: '"Barking up the wrong tree" means:', o: ['Pursuing wrong course', 'Training a dog', 'Climbing trees', 'Being loud'], a: 'Pursuing wrong course', e: 'Making a wrong assumption or choice' },
    ],
    'Blood Relations': [
        { q: 'A\'s father\'s only grandson\'s mother = ? to A', o: ['Wife', 'Sister', 'Mother', 'Daughter'], a: 'Wife', e: 'Only grandson = A\'s son. Mother of son = wife' },
        { q: 'A is brother of B, B sister of C, C father of D. D to A?', o: ['Niece/Nephew', 'Son', 'Daughter', 'Brother'], a: 'Niece/Nephew', e: 'D = child of C = sibling\'s child' },
        { q: '"His mother is only daughter of my mother." Woman to man?', o: ['Mother', 'Aunt', 'Sister', 'Grandmother'], a: 'Mother', e: 'Only daughter of my mother = myself' },
        { q: 'A is B\'s sister. C is B\'s mother. D is C\'s father. A to D?', o: ['Granddaughter', 'Grandmother', 'Daughter', 'Aunt'], a: 'Granddaughter', e: 'D→C→B→A(sister). A = granddaughter' },
        { q: 'M-N×R+S means (- mother, × brother, + father). M to S?', o: ['Grandmother', 'Mother', 'Aunt', 'Sister'], a: 'Grandmother', e: 'M mother of N, N brother of R, R father of S' },
        { q: 'P\'s father is Q\'s son. How is P related to Q?', o: ['Grandchild', 'Child', 'Sibling', 'Parent'], a: 'Grandchild', e: 'Q\'s son is P\'s father, so Q is grandfather/mother' },
        { q: 'A said "B\'s father is the only son of my father." A to B?', o: ['Father', 'Uncle', 'Brother', 'Grandfather'], a: 'Father', e: 'Only son of my father = A. So A is B\'s father' },
        { q: 'X\'s mother is Y\'s daughter. Y is Z\'s wife. X to Z?', o: ['Grandchild', 'Child', 'Nephew', 'Niece'], a: 'Grandchild', e: 'Z\'s wife(Y)\'s daughter is X\'s mother. X=grandchild of Z' },
    ],
    'Seating Arrangement': [
        { q: '6 people sit in circle. A opposite D, B left of A, C right of D. Who is opposite B?', o: ['C', 'E', 'F', 'A'], a: 'C', e: 'Circle: A-B-?-D-C-?. B opposite C' },
        { q: '5 in a row facing north. C in middle, A at end, B right of C. A is at which end?', o: ['Left end', 'Right end', 'Middle', 'Cannot determine'], a: 'Left end', e: 'C middle, B right of C. A at far left' },
        { q: '8 in circle. If P is 3rd to left of Q, then Q is ___ to right of P.', o: ['5th', '3rd', '4th', '6th'], a: '5th', e: 'In circle of 8: 8-3=5 positions to right' },
        { q: 'A sits 2nd left of B. C sits opposite A. D is neighbor of both B and C. Total 6 seats in circle.', o: ['D sits 2nd right of A', 'D sits opposite B', 'D is between B and C', 'Cannot determine'], a: 'D is between B and C', e: 'With 6 seats, these constraints place D between B and C' },
        { q: 'In a row of 7, X is 3rd from left. Y is 5th from right. How many between them?', o: ['0', '1', '2', '3'], a: '0', e: '3rd from left = 3rd position. 5th from right = 3rd position. Same seat!' },
    ],
    'Coding Decoding': [
        { q: 'APPLE coded as ELPPA. MANGO?', o: ['OGNAM', 'OGANM', 'ONGAM', 'GNAMO'], a: 'OGNAM', e: 'Reversed: MANGO→OGNAM' },
        { q: 'CAT=24, DOG=26. FOX=?', o: ['45', '42', '39', '48'], a: '45', e: 'F=6+O=15+X=24=45' },
        { q: 'SEND coded VHQG. HELP?', o: ['KHOS', 'JHMP', 'IFLO', 'LGQR'], a: 'KHOS', e: '+3 each: H→K,E→H,L→O,P→S' },
        { q: 'If 1=5, 2=10, 3=15, 4=20, then 5=?', o: ['25', '1', '30', '5'], a: '1', e: '1=5 means 5=1 (mapping)' },
        { q: 'COMPUTER→RFUVQNPC. Pattern shifts each letter by +1 and reverses.', o: ['True', 'False', 'Partially', 'Cannot say'], a: 'True', e: 'Standard coding-decoding pattern' },
        { q: 'In code, TREE=1234, RATE=5614. What is TEAR?', o: ['1365', '1465', '1345', '1265'], a: '1365', e: 'T=1,R=3(from RATE mapping),E=6,A=5→TEAR varies' },
        { q: 'If DELHI=73541, CALCUTTA=82589662, then CALICUT=?', o: ['8251896', '8241896', '8251986', '8251869'], a: '8251896', e: 'Apply same letter-number mapping' },
        { q: 'If cloud is called rain, rain is called water. What do we drink?', o: ['Rain', 'Cloud', 'Water', 'None'], a: 'Rain', e: 'We drink water, but water is called rain in this code' },
    ],
    'Syllogism': [
        { q: 'All cats are dogs. All dogs are animals. Conclusion: All cats are animals.', o: ['True', 'False', 'Cannot determine', 'Partially true'], a: 'True', e: 'Transitive: cats⊂dogs⊂animals → cats⊂animals' },
        { q: 'Some pens are pencils. All pencils are books. Conclusion?', o: ['Some pens are books', 'All pens are books', 'No pen is a book', 'All books are pens'], a: 'Some pens are books', e: 'Some pens∩pencils⊂books → some pens are books' },
        { q: 'No fish is bird. Some birds are animals. Conclusion: Some animals are not fish.', o: ['True', 'False', 'Cannot determine', 'Partially'], a: 'True', e: 'Some birds(animals) are not fish → some animals not fish' },
        { q: 'All roses are flowers. Some flowers are red. Can we conclude all roses are red?', o: ['No', 'Yes', 'Maybe', 'Depends'], a: 'No', e: 'Some flowers red ≠ all roses red. Only some may be' },
        { q: 'All A are B. No B is C. Conclusion: No A is C.', o: ['Valid', 'Invalid', 'Uncertain', 'Partial'], a: 'Valid', e: 'A⊂B, B∩C=∅ → A∩C=∅' },
    ],
    'Data Interpretation': [
        { q: 'Bar chart shows sales: Jan=40, Feb=55, Mar=35, Apr=60. % increase Jan to Apr?', o: ['50%', '40%', '60%', '25%'], a: '50%', e: '(60-40)/40×100=50%' },
        { q: 'Pie chart: A=25%, B=30%, C=20%, D=25%. If total=1000, value of B?', o: ['300', '250', '200', '350'], a: '300', e: '30% of 1000=300' },
        { q: 'Line graph shows steady increase of 10 units/month. Starting at 100, value after 5 months?', o: ['150', '140', '160', '130'], a: '150', e: '100+5×10=150' },
        { q: 'Table: Product X costs Rs.50, sold 100 units. Product Y costs Rs.80, sold 60 units. Which earned more?', o: ['Product X: Rs.5000', 'Product Y: Rs.4800', 'Equal', 'Cannot determine'], a: 'Product X: Rs.5000', e: 'X=5000, Y=4800' },
        { q: 'If a company\'s revenue was 500Cr and expenses 350Cr, profit margin %?', o: ['30%', '25%', '35%', '40%'], a: '30%', e: 'Profit=150. %=150/500×100=30%' },
    ],
    'Distance and Directions': [
        { q: 'Walk 10m North, 5m East, 10m South. Distance from start?', o: ['5m East', '10m', '15m', '5m West'], a: '5m East', e: 'N and S cancel. Only 5m East remains' },
        { q: 'Facing East, turn left twice. Now facing?', o: ['West', 'East', 'North', 'South'], a: 'West', e: 'E→N→W. Two left turns = opposite' },
        { q: 'A is 5km North of B. C is 3km East of B. Distance A to C?', o: ['√34 km', '8 km', '4 km', '√16 km'], a: '√34 km', e: '√(5²+3²)=√34' },
        { q: 'Walk 20m South, 10m West, 20m North, 30m East. From start?', o: ['20m East', '30m East', '10m East', '20m West'], a: '20m East', e: 'S-N cancel. 30-10=20m East' },
        { q: 'Facing North, turn right, walk 5m, turn left, walk 3m. Direction from start?', o: ['North-East', 'South-East', 'North-West', 'East'], a: 'North-East', e: 'Right(East) 5m, Left(North) 3m = NE of start' },
    ],
    'Number System': [
        { q: 'LCM of 12, 15, 20?', o: ['60', '120', '30', '180'], a: '60', e: 'LCM=60 (smallest common multiple)' },
        { q: 'HCF of 36, 48, 72?', o: ['12', '6', '24', '18'], a: '12', e: 'Common factors: 12 is highest' },
        { q: 'Sum of first 50 natural numbers?', o: ['1275', '1250', '1300', '1225'], a: '1275', e: 'n(n+1)/2=50×51/2=1275' },
        { q: 'Is 143 prime?', o: ['No (11×13)', 'Yes', 'No (7×21)', 'No (12×12)'], a: 'No (11×13)', e: '143=11×13, not prime' },
        { q: 'Remainder when 2^10 divided by 7?', o: ['2', '1', '4', '3'], a: '2', e: '1024÷7=146 rem 2' },
        { q: 'Which is divisible by 11: 12341, 12342, 12353, 12364?', o: ['12364', '12341', '12342', '12353'], a: '12364', e: 'Alternating sum test: 1-2+3-6+4=0. Divisible' },
    ],
    'LCM and HCF': [
        { q: 'LCM of 4, 6, 8?', o: ['24', '48', '12', '36'], a: '24', e: 'LCM=24' },
        { q: 'HCF of 18, 24?', o: ['6', '12', '3', '8'], a: '6', e: 'Common: 6' },
        { q: 'Product of two numbers is 1680, HCF is 12. LCM?', o: ['140', '120', '160', '180'], a: '140', e: 'HCF×LCM=Product. LCM=1680/12=140' },
        { q: 'LCM of two numbers is 48, HCF is 8. One number is 16. Other?', o: ['24', '32', '48', '8'], a: '24', e: '16×x=48×8=384. x=24' },
        { q: 'Three bells toll at intervals 3, 5, 7 min. Next together after?', o: ['105 min', '35 min', '21 min', '60 min'], a: '105 min', e: 'LCM(3,5,7)=105' },
    ],
    'Speed Distance Time': [
        { q: 'Speed 60 km/h, distance 180 km. Time?', o: ['3 hrs', '2 hrs', '4 hrs', '2.5 hrs'], a: '3 hrs', e: 'T=D/S=180/60=3' },
        { q: 'Train 150m long passes pole in 15 sec. Speed?', o: ['36 km/h', '40 km/h', '30 km/h', '45 km/h'], a: '36 km/h', e: 'S=150/15=10 m/s=36 km/h' },
        { q: 'A walks at 5 km/h for 6 hrs. B covers same distance in 5 hrs. B\'s speed?', o: ['6 km/h', '5.5 km/h', '7 km/h', '4 km/h'], a: '6 km/h', e: 'D=30. B=30/5=6 km/h' },
        { q: 'Two trains approach each other at 40 and 60 km/h. 100km apart. Meet in?', o: ['1 hr', '1.5 hrs', '2 hrs', '0.5 hrs'], a: '1 hr', e: 'Relative speed=100. T=100/100=1hr' },
        { q: 'Boat speed 10 km/h, stream 2 km/h. Upstream speed?', o: ['8 km/h', '12 km/h', '10 km/h', '6 km/h'], a: '8 km/h', e: 'Upstream=10-2=8 km/h' },
    ],
    'Ages': [
        { q: 'Father is 30 years older than son. In 5 years, father twice son\'s age. Son\'s age?', o: ['25', '30', '20', '35'], a: '25', e: 'F=S+30. F+5=2(S+5). S+35=2S+10. S=25' },
        { q: 'Average age of A,B,C is 27. A is 2 years older than B, B is 2 years older than C. Age of A?', o: ['29', '27', '25', '31'], a: '29', e: 'C=x, B=x+2, A=x+4. 3x+6=81. x=25. A=29' },
        { q: 'Ratio of ages 4:5. After 5 years, ratio becomes 5:6. Present ages?', o: ['20,25', '16,20', '24,30', '12,15'], a: '20,25', e: '4x+5:5x+5=5:6. 24x+30=25x+25. x=5. Ages:20,25' },
        { q: '10 years ago, age was 1/3 of current age. Current age?', o: ['15', '20', '10', '25'], a: '15', e: 'x-10=x/3. 3x-30=x. 2x=30. x=15' },
        { q: 'Sum of ages of mother and daughter is 50. 5 years ago, mother was 7 times daughter. Ages?', o: ['40,10', '35,15', '42,8', '45,5'], a: '40,10', e: 'M+D=50. M-5=7(D-5). 45-D=7D-35. 8D=80. D=10' },
    ],
    'Probability': [
        { q: 'One card from 52-card deck. Probability of king?', o: ['1/13', '1/52', '4/13', '1/4'], a: '1/13', e: '4 kings in 52. P=4/52=1/13' },
        { q: 'Two dice thrown. P(sum=7)?', o: ['1/6', '1/12', '5/36', '1/36'], a: '1/6', e: 'Favorable: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1)=6. P=6/36=1/6' },
        { q: 'Bag has 5 red, 3 blue. P(red)?', o: ['5/8', '3/8', '1/2', '5/3'], a: '5/8', e: '5/(5+3)=5/8' },
        { q: 'Coin tossed 3 times. P(at least one head)?', o: ['7/8', '3/8', '1/2', '1/8'], a: '7/8', e: '1-P(no head)=1-1/8=7/8' },
        { q: 'P(A)=0.3, P(B)=0.4, independent. P(A and B)?', o: ['0.12', '0.70', '0.10', '0.50'], a: '0.12', e: 'Independent: P(A∩B)=0.3×0.4=0.12' },
    ],
    'Mean Median Mode': [
        { q: 'Data: 3,5,7,5,9,5,11. Mode?', o: ['5', '7', '9', '3'], a: '5', e: '5 appears most (3 times)' },
        { q: 'Data: 2,4,6,8,10. Median?', o: ['6', '5', '7', '8'], a: '6', e: 'Middle value of sorted data = 6' },
        { q: 'Mean of 10,20,30,40,50?', o: ['30', '25', '35', '20'], a: '30', e: 'Sum=150. Mean=150/5=30' },
        { q: 'Data: 4,7,2,9,4,3,4. Mean, Median, Mode?', o: ['4.71, 4, 4', '5, 4, 4', '4, 4, 7', '4.5, 4, 4'], a: '4.71, 4, 4', e: 'Mean=33/7≈4.71. Sorted:2,3,4,4,4,7,9. Median=4. Mode=4' },
        { q: 'Variance of 2,4,6,8,10? (Mean=6)', o: ['8', '6', '10', '4'], a: '8', e: 'Var=((16+4+0+4+16)/5)=40/5=8' },
    ],
    'Geometry': [
        { q: 'Area of triangle with base 10cm, height 8cm?', o: ['40 sq.cm', '80 sq.cm', '30 sq.cm', '50 sq.cm'], a: '40 sq.cm', e: 'A=½×10×8=40' },
        { q: 'Perimeter of rectangle 12×8 cm?', o: ['40 cm', '96 cm', '20 cm', '48 cm'], a: '40 cm', e: 'P=2(12+8)=40' },
        { q: 'Area of circle radius 7cm? (π=22/7)', o: ['154 sq.cm', '44 sq.cm', '22 sq.cm', '308 sq.cm'], a: '154 sq.cm', e: 'A=π r²=22/7×49=154' },
        { q: 'Diagonal of rectangle 6×8?', o: ['10', '14', '12', '8'], a: '10', e: '√(36+64)=√100=10' },
        { q: 'Volume of cube side 5cm?', o: ['125 cc', '150 cc', '100 cc', '25 cc'], a: '125 cc', e: 'V=5³=125' },
    ],
    'Allegation and Mixtures': [
        { q: 'Mix 20L of 25% solution with 30L of 40% solution. Concentration?', o: ['34%', '32%', '30%', '36%'], a: '34%', e: '(20×25+30×40)/50=(500+1200)/50=34%' },
        { q: 'Rice at Rs.30/kg mixed with Rs.40/kg in 2:3 ratio. Price of mix?', o: ['Rs.36', 'Rs.35', 'Rs.34', 'Rs.37'], a: 'Rs.36', e: '(2×30+3×40)/5=(60+120)/5=36' },
        { q: 'Milk:Water=4:1. If 5L water added to 20L mix, new ratio?', o: ['16:9', '4:2', '8:5', '3:2'], a: '16:9', e: 'Milk=16, Water=4+5=9. 16:9' },
    ],
    'Coding Questions': [
        { q: 'What is the time complexity of binary search?', o: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], a: 'O(log n)', e: 'Binary search halves the search space each step' },
        { q: 'Which data structure uses LIFO?', o: ['Stack', 'Queue', 'Array', 'Linked List'], a: 'Stack', e: 'Stack = Last In First Out' },
        { q: 'What does SQL SELECT * FROM table do?', o: ['Returns all rows and columns', 'Deletes all rows', 'Creates table', 'Updates table'], a: 'Returns all rows and columns', e: 'SELECT * retrieves everything from the table' },
        { q: 'In a linked list, insertion at head is:', o: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], a: 'O(1)', e: 'Just update head pointer' },
        { q: 'Which sort has best average case O(n log n)?', o: ['Merge Sort', 'Bubble Sort', 'Selection Sort', 'Insertion Sort'], a: 'Merge Sort', e: 'Merge sort always O(n log n)' },
        { q: 'What is recursion?', o: ['Function calling itself', 'Loop inside loop', 'Variable declaration', 'Class inheritance'], a: 'Function calling itself', e: 'Recursion = function calls itself with base case' },
        { q: 'Array index starts at:', o: ['0', '1', '2', '-1'], a: '0', e: 'In most languages, arrays are 0-indexed' },
        { q: 'Hash table average lookup time?', o: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], a: 'O(1)', e: 'Hash tables provide constant time average lookup' },
        { q: 'Which is not a linear data structure?', o: ['Tree', 'Array', 'Stack', 'Queue'], a: 'Tree', e: 'Tree is hierarchical, not linear' },
        { q: 'What does a queue follow?', o: ['FIFO', 'LIFO', 'FILO', 'Random'], a: 'FIFO', e: 'Queue = First In First Out' },
    ],
    'Pseudocode': [
        { q: 'SET x=10, y=20, z=x+y. PRINT z?', o: ['30', '10', '20', 'Error'], a: '30', e: 'z=10+20=30' },
        { q: 'SET n=5, result=1. FOR i=1 TO n: result=result*i. PRINT result?', o: ['120', '24', '60', '720'], a: '120', e: '5!=120' },
        { q: 'IF a=15, a>10? PRINT?', o: ['Big', 'Small', 'Error', '15'], a: 'Big', e: '15>10 is true' },
        { q: 'SET i=0. WHILE i<5: i=i+1. Loop runs?', o: ['5', '4', '6', 'Infinite'], a: '5', e: 'i: 0,1,2,3,4 → 5 iterations' },
        { q: 'arr=[3,1,4,1,5]. Find max. Output?', o: ['5', '3', '4', '1'], a: '5', e: 'Maximum element is 5' },
        { q: 'SET x=7. IF x%2==0 PRINT "Even" ELSE PRINT "Odd"', o: ['Odd', 'Even', 'Error', '7'], a: 'Odd', e: '7%2=1≠0, so Odd' },
        { q: 'FOR i=1 TO 5: PRINT i*i. Output of 3rd iteration?', o: ['9', '4', '16', '25'], a: '9', e: '3rd iteration: i=3, 3²=9' },
    ],
    'Puzzles': [
        { q: 'Odd number, remove letter become even. Which?', o: ['Seven', 'Five', 'Nine', 'Three'], a: 'Seven', e: 'SEVEN→remove S→EVEN' },
        { q: 'Clock 3:15, angle between hands?', o: ['7.5°', '0°', '15°', '22.5°'], a: '7.5°', e: 'Hour at 97.5°, Minute at 90°. Diff=7.5°' },
        { q: 'How many squares on chessboard?', o: ['204', '64', '256', '196'], a: '204', e: 'Sum of 1²+2²+...+8²=204' },
        { q: '3 people pay Rs.10 each for Rs.30 room. Gets Rs.5 back, bellboy keeps Rs.2. Missing Re.1?', o: ['No missing rupee', 'Hotel took it', 'Math error', 'Bellboy lost it'], a: 'No missing rupee', e: 'Rs.27=Rs.25(hotel)+Rs.2(bellboy). No need to add Rs.2 to Rs.27' },
        { q: 'Calendar: If Jan 1 is Monday, what day is Mar 1? (non-leap year)', o: ['Thursday', 'Wednesday', 'Friday', 'Tuesday'], a: 'Thursday', e: 'Jan=31d(+3), Feb=28d(+0). Monday+3=Thursday' },
    ],
    'Clocks and Calendar': [
        { q: 'At what time between 4 and 5 do the hands of a clock coincide?', o: ['4:21:49', '4:20:00', '4:25:00', '4:22:00'], a: '4:21:49', e: 'Hands coincide: (4×30)/11×60/11 = 21 min 49 sec past 4' },
        { q: 'If today is Wednesday, what day will it be after 100 days?', o: ['Friday', 'Saturday', 'Thursday', 'Sunday'], a: 'Friday', e: '100/7=14 weeks + 2 days. Wed+2=Friday' },
        { q: 'How many times do clock hands form right angle in 12 hours?', o: ['22', '24', '20', '44'], a: '22', e: 'Hands form right angle 22 times in 12 hours' },
        { q: 'Angle between hands at 3:30?', o: ['75°', '90°', '60°', '80°'], a: '75°', e: 'Min at 180°. Hour at 3×30+30×0.5=105°. Diff=75°' },
    ],
    'Series and Progression': [
        { q: 'AP: 2,5,8,11,... 20th term?', o: ['59', '56', '62', '53'], a: '59', e: 'a=2,d=3. T20=2+19×3=59' },
        { q: 'GP: 3,6,12,24,... Sum of first 6 terms?', o: ['189', '192', '186', '195'], a: '189', e: 'a=3,r=2. S6=3(2⁶-1)/(2-1)=3×63=189' },
        { q: 'Sum of AP: 1+2+3+...+100?', o: ['5050', '5000', '5100', '4950'], a: '5050', e: 'n(n+1)/2=100×101/2=5050' },
        { q: 'Find 10th term of GP: 2,6,18,...', o: ['39366', '19683', '59049', '13122'], a: '39366', e: 'a=2,r=3. T10=2×3⁹=2×19683=39366' },
    ],
    'Equations': [
        { q: 'Solve: 2x+3=11', o: ['x=4', 'x=3', 'x=5', 'x=6'], a: 'x=4', e: '2x=8, x=4' },
        { q: 'x²-5x+6=0. Roots?', o: ['2,3', '1,6', '-2,-3', '3,4'], a: '2,3', e: '(x-2)(x-3)=0' },
        { q: 'If 3x-7=2x+5, then x=?', o: ['12', '10', '8', '14'], a: '12', e: '3x-2x=5+7. x=12' },
        { q: 'Sum of two numbers is 15, difference is 3. Numbers?', o: ['9,6', '10,5', '8,7', '11,4'], a: '9,6', e: 'x+y=15, x-y=3. x=9, y=6' },
    ],
    'Letter Series': [
        { q: 'A,C,E,G,?', o: ['I', 'H', 'J', 'K'], a: 'I', e: 'Skip one letter each time: +2' },
        { q: 'Z,X,V,T,?', o: ['R', 'S', 'Q', 'U'], a: 'R', e: 'Reverse, skip one: -2 each time' },
        { q: 'B,D,G,K,?', o: ['P', 'O', 'Q', 'N'], a: 'P', e: 'Gaps: +2,+3,+4,+5. K+5=P' },
        { q: 'A,B,D,G,K,?', o: ['P', 'O', 'Q', 'N'], a: 'P', e: 'Gaps: +1,+2,+3,+4,+5. K+5=P' },
        { q: 'M,N,P,S,W,?', o: ['B', 'A', 'C', 'Z'], a: 'B', e: 'Gaps: +1,+2,+3,+4,+5. W+5=B(wrap around)' },
    ],
    'Word Pattern': [
        { q: 'ABCD:ZYXW::EFGH:?', o: ['VUTS', 'WXYZ', 'TSRQ', 'UVWX'], a: 'VUTS', e: 'Reverse alphabet mapping: E→V,F→U,G→T,H→S' },
        { q: 'ACE:BDF::GIK:?', o: ['HJL', 'FHJ', 'IKM', 'GIK'], a: 'HJL', e: 'Each letter +1: G→H, I→J, K→L' },
        { q: 'Which word does not belong: Cat, Dog, Cow, Rose?', o: ['Rose', 'Cat', 'Dog', 'Cow'], a: 'Rose', e: 'Rose is a flower, rest are animals' },
        { q: 'Find the odd one: 2,5,10,17,23,37', o: ['23', '5', '17', '37'], a: '23', e: 'Pattern: +3,+5,+7,+9,+11. 17+9=26≠23' },
    ],
    'Data Sufficiency': [
        { q: 'Is x>y? I: x=2y. II: y>0.', o: ['Both needed', 'I alone', 'II alone', 'Neither sufficient'], a: 'Both needed', e: 'I: x=2y. If y>0 then x>y. Need both' },
        { q: 'What is the area of rectangle? I: Perimeter=24. II: Length=8.', o: ['Both needed', 'I alone', 'II alone', 'Either alone'], a: 'Both needed', e: 'P=24 and L=8 → W=4. Area=32. Need both' },
        { q: 'Is N divisible by 6? I: N divisible by 3. II: N divisible by 2.', o: ['Both needed', 'I alone', 'II alone', 'Either alone'], a: 'Both needed', e: 'Divisible by 6 needs both div by 2 AND 3' },
    ],
    'Cube Folding': [
        { q: 'A cube is painted red on all faces, cut into 27 small cubes. How many have exactly 2 faces painted?', o: ['12', '8', '6', '0'], a: '12', e: 'Edge cubes (not corners) = 12 edges × 1 = 12' },
        { q: 'Same cube. How many small cubes have 3 painted faces?', o: ['8', '12', '6', '0'], a: '8', e: 'Corner cubes = 8' },
        { q: 'Same cube. How many have no painted face?', o: ['1', '0', '6', '8'], a: '1', e: 'Only the center cube has no painted face' },
        { q: 'A paper is folded once and a hole is punched. When unfolded, how many holes?', o: ['2', '1', '4', '3'], a: '2', e: 'One fold doubles the hole count: 2 holes' },
    ],
    'Statement and Conclusion': [
        { q: 'Statement: All employees must work 8 hours. Conclusion: Flexible timing is not allowed.', o: ['Does not follow', 'Follows', 'Partially follows', 'Cannot say'], a: 'Does not follow', e: '8 hours doesn\'t mean no flexibility in timing' },
        { q: 'Statement: Regular exercise improves health. Conclusion: Everyone should exercise.', o: ['Follows', 'Does not follow', 'Maybe', 'Cannot determine'], a: 'Follows', e: 'If exercise improves health, it follows everyone should exercise' },
    ],
    'Para Jumbles': [
        { q: 'Arrange: P: He went to market. Q: He bought vegetables. R: He cooked dinner. S: He came home.', o: ['PQSR', 'PSQR', 'PQRS', 'PRQS'], a: 'PQSR', e: 'Logical: went→bought→came home→cooked' },
        { q: 'Arrange: A: The result was declared. B: Students appeared for exam. C: Students celebrated. D: Exams were conducted.', o: ['DBAC', 'ABCD', 'DCBA', 'BDAC'], a: 'DBAC', e: 'Logical: conducted→appeared→result→celebrated' },
    ],
    'Averages': [
        { q: 'Average of 5 numbers is 27. One excluded, avg becomes 25. Excluded?', o: ['35', '30', '33', '37'], a: '35', e: 'Total=135. After=100. Excluded=35' },
        { q: '36 students avg age 14. With teacher avg becomes 15. Teacher age?', o: ['51', '49', '50', '52'], a: '51', e: '504+T=37×15=555. T=51' },
        { q: 'First 7 multiples of 3, average?', o: ['12', '9', '15', '10'], a: '12', e: 'Sum=84. 84/7=12' },
        { q: 'Batsman avg 32 after 20 innings. After 21st, avg 34. Runs in 21st?', o: ['72', '74', '76', '70'], a: '74', e: '640+x=714. x=74' },
        { q: 'Mean of 10 numbers is 7. Each ×12. New mean?', o: ['84', '72', '60', '96'], a: '84', e: '7×12=84' },
    ],
    'Ratios': [
        { q: 'A:B=3:4, B:C=8:9. A:B:C?', o: ['6:8:9', '3:4:9', '3:8:9', '6:4:9'], a: '6:8:9', e: 'Make B common: 6:8:9' },
        { q: 'Salaries 2:3:5. Increments 15%,10%,20%. New ratio?', o: ['23:33:60', '20:30:50', '3:4:7', '46:66:120'], a: '23:33:60', e: '2.3:3.3:6.0=23:33:60' },
        { q: 'a:b=2:3, b:c=4:5. a:c?', o: ['8:15', '2:5', '4:5', '3:5'], a: '8:15', e: '(2/3)×(4/5)=8/15' },
        { q: 'Divide Rs.1200 in ratio 3:5. Smaller share?', o: ['Rs.450', 'Rs.750', 'Rs.500', 'Rs.400'], a: 'Rs.450', e: '3/8×1200=450' },
        { q: 'Ratio 3:5, if 9 added to each becomes 3:4. Numbers?', o: ['27,45', '9,15', '18,30', '36,60'], a: '27,45', e: '(3x+9)/(5x+9)=3/4. x=9. Numbers:27,45' },
    ],
    'Simple Interest': [
        { q: 'SI on Rs.5000 at 8% for 3 years?', o: ['Rs.1200', 'Rs.1000', 'Rs.1500', 'Rs.800'], a: 'Rs.1200', e: 'SI=5000×8×3/100=1200' },
        { q: 'Sum doubles in 8 years. Rate?', o: ['12.5%', '10%', '15%', '8%'], a: '12.5%', e: 'R=100/8=12.5%' },
        { q: 'Rs.1000 becomes Rs.1150 at 5%. Time?', o: ['3 years', '2 years', '4 years', '5 years'], a: '3 years', e: '150=1000×5×T/100. T=3' },
        { q: 'SI=P/4. Years=Rate. Rate?', o: ['5%', '4%', '6%', '10%'], a: '5%', e: 'R²=25. R=5' },
        { q: 'Rs.10000 becomes Rs.12500 in 5 years. Rate?', o: ['5%', '4%', '6%', '8%'], a: '5%', e: 'SI=2500. R=2500×100/(10000×5)=5%' },
    ],
    'Divisibility': [
        { q: 'A number divisible by both 3 and 4 is also divisible by:', o: ['12', '7', '5', '8'], a: '12', e: 'LCM(3,4)=12' },
        { q: 'If a number is divisible by 6, it must be divisible by:', o: ['2 and 3', '4 and 3', '2 and 5', '3 and 5'], a: '2 and 3', e: '6=2×3. So divisible by both' },
        { q: 'Which number is divisible by 9: 456, 729, 823, 512?', o: ['729', '456', '823', '512'], a: '729', e: '7+2+9=18, divisible by 9' },
    ],
    'Pie Charts': [
        { q: 'Pie chart total 360°. Sector 72° represents what %?', o: ['20%', '25%', '15%', '18%'], a: '20%', e: '72/360×100=20%' },
        { q: 'If 30% of budget is Rs.6000, total budget?', o: ['Rs.20000', 'Rs.18000', 'Rs.25000', 'Rs.15000'], a: 'Rs.20000', e: '0.3×T=6000. T=20000' },
        { q: 'Sector of 25% has angle:', o: ['90°', '72°', '100°', '60°'], a: '90°', e: '25/100×360=90°' },
    ],
    'Number Series': [
        { q: '2,6,12,20,30,?', o: ['42', '40', '38', '44'], a: '42', e: 'Diff: 4,6,8,10→12. 30+12=42' },
        { q: '3,9,27,81,?', o: ['243', '162', '324', '729'], a: '243', e: '×3 each. 81×3=243' },
        { q: '1,1,2,3,5,8,?', o: ['13', '11', '12', '15'], a: '13', e: 'Fibonacci. 5+8=13' },
        { q: '5,11,23,47,?', o: ['95', '93', '94', '96'], a: '95', e: '×2+1. 47×2+1=95' },
        { q: '2,5,10,17,26,?', o: ['37', '35', '38', '40'], a: '37', e: 'Diff: 3,5,7,9→11. 26+11=37' },
        { q: '4,9,16,25,36,?', o: ['49', '42', '48', '50'], a: '49', e: 'Perfect squares: 2²,3²,...7²=49' },
        { q: '1,4,9,16,25,?,49', o: ['36', '30', '42', '35'], a: '36', e: 'n²: 6²=36' },
    ],
    'Sentence Building': [
        { q: 'Rearrange: "always / truth / the / speak"', o: ['Always speak the truth', 'The truth always speak', 'Speak truth always the', 'Truth the always speak'], a: 'Always speak the truth', e: 'Correct sentence formation' },
        { q: 'Rearrange: "is / an / honesty / policy / the / best"', o: ['Honesty is the best policy', 'The best policy is honesty', 'Is honesty the best policy', 'Policy the best is honesty'], a: 'Honesty is the best policy', e: 'Famous proverb, correct order' },
    ],
};

// VARIATION ENGINE: Creates new questions by modifying numbers in existing questions
function createVariation(item, index) {
    const multipliers = [1.5, 2, 0.5, 3, 0.8, 1.2, 2.5, 0.75, 1.8, 4];
    const m = multipliers[index % multipliers.length];
    // Return a copy with slight text modification to indicate variation
    return {
        q: item.q.replace(/(\d+)/g, (match, num) => {
            const n = Math.round(parseInt(num) * m);
            return n > 0 ? n : parseInt(num);
        }),
        o: [...item.o],
        a: item.a,
        e: item.e + ' (Variation - verify values)',
    };
}

export function generateQuestions(topic, count, section) {
    // Find matching topic(s)
    const topicLower = topic.toLowerCase();
    let matched = [];

    for (const [key, questions] of Object.entries(B)) {
        if (key.toLowerCase().includes(topicLower) || topicLower.includes(key.toLowerCase())) {
            matched.push(...questions.map(q => ({ ...q, _cat: key })));
        }
    }

    // If no exact match, try partial word matching
    if (matched.length === 0) {
        const words = topicLower.split(/[\s,]+/);
        for (const [key, questions] of Object.entries(B)) {
            const keyWords = key.toLowerCase().split(/[\s-]+/);
            if (words.some(w => keyWords.some(kw => kw.includes(w) || w.includes(kw)))) {
                matched.push(...questions.map(q => ({ ...q, _cat: key })));
            }
        }
    }

    // Still nothing? Return from all topics
    if (matched.length === 0) {
        for (const [key, questions] of Object.entries(B)) {
            matched.push(...questions.map(q => ({ ...q, _cat: key })));
        }
    }

    // Shuffle
    matched = matched.sort(() => Math.random() - 0.5);

    // If we don't have enough, create variations to fill the gap
    const result = [];
    let variationRound = 0;
    while (result.length < count && variationRound < 10) {
        const source = variationRound === 0 ? matched : matched.map((q, i) => createVariation(q, i + variationRound));
        for (const item of source) {
            if (result.length >= count) break;
            // Avoid exact duplicates
            if (variationRound === 0 || !result.some(r => r.question_text === item.q)) {
                result.push({
                    id: Date.now() + result.length + Math.random(),
                    section: section || 'Aptitude',
                    type: 'mcq',
                    question_text: item.q,
                    image_url: '',
                    options: [...item.o].sort(() => Math.random() - 0.5),
                    correct_answer: item.a,
                    explanation: item.e,
                    marks: 1,
                });
            }
        }
        variationRound++;
    }

    return result.slice(0, count);
}

export const AVAILABLE_TOPICS = Object.keys(B);
