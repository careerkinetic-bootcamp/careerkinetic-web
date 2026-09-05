export const QUESTIONS = [
  // ==================== CODING (1-5) ====================
  {
    id: 1,
    category: 'coding',
    categoryLabel: 'Coding Skills',
    question: 'Which of the following is used to store multiple items under a single variable name?',
    options: [
      'Integer',
      'Array / List',
      'String',
      'Boolean'
    ],
    correctIndex: 1,
    explanation: 'An Array or List is a data structure used to store a collection of multiple elements (like numbers, text, or objects) under a single variable name.'
  },
  {
    id: 2,
    category: 'coding',
    categoryLabel: 'Coding Skills',
    question: 'Which loop is best suited when you know the exact number of times you want to repeat a block of code?',
    options: [
      'while loop',
      'for loop',
      'if-else loop',
      'do-while loop'
    ],
    correctIndex: 1,
    explanation: 'A "for" loop is typically used when the number of iterations is known beforehand. A "while" loop is generally used when looping until a specific condition becomes false.'
  },
  {
    id: 3,
    category: 'coding',
    categoryLabel: 'Coding Skills',
    question: 'What is a "syntax error" in programming?',
    options: [
      'An error that occurs while running the code due to dividing by zero.',
      'A grammatical mistake in the code that violates the rules of the programming language.',
      'An error caused by the computer running out of storage memory.',
      'A logical flaw that gives the wrong output.'
    ],
    correctIndex: 1,
    explanation: 'A syntax error is a violation of the grammatical rules of the programming language. Code with syntax errors cannot compile or run.'
  },
  {
    id: 4,
    category: 'coding',
    categoryLabel: 'Coding Skills',
    question: 'Which keyword is used in most programming languages to execute a block of code only if a specified condition is true?',
    options: [
      'else',
      'loop',
      'if',
      'switch'
    ],
    correctIndex: 2,
    explanation: 'The "if" keyword is used to start a conditional statement that runs a block of code if the given condition evaluates to true.'
  },
  {
    id: 5,
    category: 'coding',
    categoryLabel: 'Coding Skills',
    question: 'What is the primary purpose of writing a "function" in programming?',
    options: [
      'To make the code run slower.',
      'To reuse a block of code without writing it multiple times.',
      'To connect the application to the internet.',
      'To declare a single constant variable.'
    ],
    correctIndex: 1,
    explanation: 'Functions allow developers to group code into reusable blocks. This avoids code repetition, makes maintenance easier, and improves readability.'
  },

  // ==================== COMMUNICATION (6-10) ====================
  {
    id: 6,
    category: 'communication',
    categoryLabel: 'Communication Skills',
    question: 'While a teammate is explaining a technical issue they are facing, what is the best practice for active listening?',
    options: [
      'Interrupt them immediately as soon as you think of a solution.',
      'Look at your phone to check messages while they talk.',
      'Listen attentively without interrupting, and summarize their point afterwards to confirm understanding.',
      'Think about what you will say next and ignore their details.'
    ],
    correctIndex: 2,
    explanation: 'Active listening involves paying full attention, avoiding interruptions, and summarizing what you heard to verify that you fully understand the speaker.'
  },
  {
    id: 7,
    category: 'communication',
    categoryLabel: 'Communication Skills',
    question: 'You finish your assigned tasks in a group project two days before the deadline. What is the most collaborative action to take?',
    options: [
      'Log off for the rest of the days and don\'t communicate with the team.',
      'Inform your team members and offer help to those who are still working on their tasks.',
      'Start rewriting a team member\'s code without discussing it with them.',
      'Complain to the coordinator that other team members are slower than you.'
    ],
    correctIndex: 1,
    explanation: 'Proactively offering to help team members when you finish early fosters a strong collaborative team dynamic and ensures project success.'
  },
  {
    id: 8,
    category: 'communication',
    categoryLabel: 'Communication Skills',
    question: 'When emailing a professor or a project manager for help, which format is the most appropriate?',
    options: [
      'Using slang and shortcut words (e.g. "pls help asap, thx!").',
      'Providing a clear subject line, a polite greeting, a concise summary of the issue, and a professional closing.',
      'Writing the entire email in capital letters to show that it is urgent.',
      'Sending an email with no subject line and just a screenshot of your screen.'
    ],
    correctIndex: 1,
    explanation: 'Professional written communication requires a clear subject line, a polite greeting, a clear explanation of the purpose/issue, and a polite sign-off.'
  },
  {
    id: 9,
    category: 'communication',
    categoryLabel: 'Communication Skills',
    question: 'During a peer review, a classmate suggests that your documentation is unclear. What is the best way to handle this feedback?',
    options: [
      'Take it personally and argue that your documentation is perfect.',
      'Ignore their comments and submit the documentation anyway.',
      'Thank them for the feedback, review the specific section they found unclear, and revise it for better clarity.',
      'Report them for giving negative feedback.'
    ],
    correctIndex: 2,
    explanation: 'Constructive feedback should be viewed objectively. Reviewing and revising unclear work based on peer feedback leads to better quality results.'
  },
  {
    id: 10,
    category: 'communication',
    categoryLabel: 'Communication Skills',
    question: 'What is the most important rule of technical communication when explaining a project to others?',
    options: [
      'Use highly complex jargon and vocabulary words to sound smart.',
      'Keep the message clear, simple, and tailored to the audience\'s level of understanding.',
      'Write extremely long paragraphs without bullet points or headers.',
      'Provide only raw code files instead of talking.'
    ],
    correctIndex: 1,
    explanation: 'The primary goal of communication is understanding. Tailoring your explanation to the audience\'s level and keeping it simple ensures they comprehend your message.'
  },

  // ==================== LOGIC & REASONING (11-15) ====================
  {
    id: 11,
    category: 'logic',
    categoryLabel: 'Logic & Reasoning',
    question: 'If "All books have pages" and "This item is a book", which of the following is logically guaranteed?',
    options: [
      'This item is heavy.',
      'This item definitely has pages.',
      'This item might have pages.',
      'This item has no pages.'
    ],
    correctIndex: 1,
    explanation: 'This is a classical syllogism (Modus Ponens). If the general rule (all books have pages) and the specific premise (this item is a book) are true, then the conclusion (it has pages) is logically guaranteed.'
  },
  {
    id: 12,
    category: 'logic',
    categoryLabel: 'Logic & Reasoning',
    question: 'Find the next number in the pattern: 3, 6, 9, 12, 15, ___?',
    options: [
      '16',
      '18',
      '20',
      '21'
    ],
    correctIndex: 1,
    explanation: 'The series is an arithmetic progression where each number increases by 3 (3, 6, 9, 12, 15). The next number is 15 + 3 = 18.'
  },
  {
    id: 13,
    category: 'logic',
    categoryLabel: 'Logic & Reasoning',
    question: 'If you walk 10 steps North, turn right, and walk 5 steps, which direction are you facing?',
    options: [
      'North',
      'South',
      'East',
      'West'
    ],
    correctIndex: 2,
    explanation: 'Facing North and turning right (90 degrees clockwise) changes your direction to face East.'
  },
  {
    id: 14,
    category: 'logic',
    categoryLabel: 'Logic & Reasoning',
    question: 'In logic, if statement P is True, and statement Q is False, what is the truth value of the combined statement "P AND Q"?',
    options: [
      'True',
      'False',
      'Undetermined',
      'Both True and False'
    ],
    correctIndex: 1,
    explanation: 'For a conjunction (AND) to be True, BOTH individual statements must be True. Since Q is False, "P AND Q" is False.'
  },
  {
    id: 15,
    category: 'logic',
    categoryLabel: 'Logic & Reasoning',
    question: '"Triangle" is related to "3" as "Pentagon" is related to:',
    options: [
      '4',
      '5',
      '6',
      '8'
    ],
    correctIndex: 1,
    explanation: 'A triangle is a polygon with 3 sides. A pentagon is a polygon with 5 sides.'
  },

  // ==================== MATHEMATICS (16-20) ====================
  {
    id: 16,
    category: 'math',
    categoryLabel: 'Mathematics',
    question: 'If a student scores 45 out of 60 marks in an exam, what is their percentage score?',
    options: [
      '70%',
      '75%',
      '80%',
      '65%'
    ],
    correctIndex: 1,
    explanation: 'Percentage score is calculated as (obtained marks / total marks) * 100. So, (45 / 60) * 100 = 0.75 * 100 = 75%.'
  },
  {
    id: 17,
    category: 'math',
    categoryLabel: 'Mathematics',
    question: 'Solve for x: 2x + 7 = 15.',
    options: [
      '3',
      '4',
      '5',
      '8'
    ],
    correctIndex: 1,
    explanation: 'Subtract 7 from both sides: 2x = 15 - 7 => 2x = 8. Divide by 2: x = 8 / 2 => x = 4.'
  },
  {
    id: 18,
    category: 'math',
    categoryLabel: 'Mathematics',
    question: 'If you flip a fair, two-sided coin once, what is the probability of getting Heads?',
    options: [
      '0.25',
      '0.5',
      '0.75',
      '1.0'
    ],
    correctIndex: 1,
    explanation: 'A fair coin has 2 equally likely outcomes (Heads or Tails). The probability of Heads is 1 / 2 = 0.5.'
  },
  {
    id: 19,
    category: 'math',
    categoryLabel: 'Mathematics',
    question: 'What is the average (mean) of the numbers 10, 20, and 30?',
    options: [
      '15',
      '20',
      '25',
      '30'
    ],
    correctIndex: 1,
    explanation: 'The average is the sum divided by the count. Sum = 10 + 20 + 30 = 60. Count = 3. Average = 60 / 3 = 20.'
  },
  {
    id: 20,
    category: 'math',
    categoryLabel: 'Mathematics',
    question: 'A rectangular room has a length of 5 meters and a width of 4 meters. What is the area of the room in square meters?',
    options: [
      '9 sq m',
      '18 sq m',
      '20 sq m',
      '25 sq m'
    ],
    correctIndex: 2,
    explanation: 'The area of a rectangle is length multiplied by width: 5 meters * 4 meters = 20 square meters.'
  }
];

/**
 * Determines which course pathway is recommended for the student.
 * 
 * Rules:
 * - 5 math questions, 5 logic questions.
 * - Score >= 60% in both Math & Logic (at least 3 correct in each) -> AI/ML Engineering
 * - Otherwise -> Software Engineering (default)
 * 
 * @param {Object} categoryScores { coding: number, communication: number, logic: number, math: number }
 * @returns {String} 'aiml' or 'se'
 */
export const determineRecommendation = (categoryScores) => {
  const mathCorrect = categoryScores.math || 0;
  const logicCorrect = categoryScores.logic || 0;

  // 3 out of 5 is 60%
  const meetsMath = mathCorrect >= 3;
  const meetsLogic = logicCorrect >= 3;

  if (meetsMath && meetsLogic) {
    return 'aiml';
  } else {
    return 'se';
  }
};
