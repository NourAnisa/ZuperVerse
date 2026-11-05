/**
 * ZuperVerse - Default Interactive Multi-Type Question Bank
 * Supports 5 Assessment Question Types:
 * 1. multiple_choice
 * 2. true_false
 * 3. short_answer
 * 4. matching
 * 5. ordering
 */

const ZUPER_DEFAULT_QUESTIONS = [
    // -------------------------------------------------------------------------
    // TYPE 1: MULTIPLE CHOICE (Pilihan Ganda)
    // -------------------------------------------------------------------------
    {
        id: "mc-01",
        type: "multiple_choice",
        subject: "English Math",
        topic: "Fractions & Word Problems",
        question: "Sarah has 24 apples. She gives 1/4 of them to Budi and 1/3 of them to Siti. How many apples does Sarah have left?",
        options: ["10 apples", "14 apples", "8 apples", "12 apples"],
        correctAnswer: 0, // 10 apples (24 - 6 - 8 = 10)
        explanation: "1/4 of 24 = 6 apples. 1/3 of 24 = 8 apples. Total given away = 6 + 8 = 14 apples. Left = 24 - 14 = 10 apples.",
        difficultyTarget: "medium", // for psychometrics
        points: 100
    },
    {
        id: "mc-02",
        type: "multiple_choice",
        subject: "English Math",
        topic: "Ordinal Numbers & Decimals",
        question: "What is the correct English pronunciation and form of the decimal number 3.75?",
        options: ["Three point seventy-five", "Three point seven five", "Three comma seventy five", "Three dot seven five"],
        correctAnswer: 1, // Three point seven five
        explanation: "In English mathematics, decimal digits after the decimal point are always spoken individually: 'three point seven five'.",
        difficultyTarget: "easy",
        points: 100
    },
    {
        id: "mc-03",
        type: "multiple_choice",
        subject: "Science & Math (IPA)",
        topic: "Speed & Velocity",
        question: "A digital learning drone flies 150 meters in 10 seconds. What is its speed?",
        options: ["15 m/s", "1500 m/s", "140 m/s", "25 m/s"],
        correctAnswer: 0,
        explanation: "Formula of Speed: v = s / t = 150 meters / 10 seconds = 15 m/s.",
        difficultyTarget: "easy",
        points: 100
    },

    // -------------------------------------------------------------------------
    // TYPE 2: TRUE / FALSE (Benar / Salah)
    // -------------------------------------------------------------------------
    {
        id: "tf-01",
        type: "true_false",
        subject: "Mathematics",
        topic: "Number Properties",
        question: "Statement: 'The number 2 is the ONLY even prime number in mathematics.'",
        options: ["TRUE (Benar)", "FALSE (Salah)"],
        correctAnswer: 0, // True
        explanation: "2 is indeed the only even prime number because every other even number is divisible by 2 and therefore composite.",
        difficultyTarget: "easy",
        points: 80
    },
    {
        id: "tf-02",
        type: "true_false",
        subject: "English Math",
        topic: "Mathematical Terms",
        question: "Statement: 'In English, the result of a division operation is called the PRODUCT.'",
        options: ["TRUE (Benar)", "FALSE (Salah)"],
        correctAnswer: 1, // False (It is QUOTIENT; product is multiplication)
        explanation: "The result of division is called the 'Quotient'. The result of multiplication is the 'Product'.",
        difficultyTarget: "medium",
        points: 80
    },

    // -------------------------------------------------------------------------
    // TYPE 3: SHORT ANSWER (Isian Singkat)
    // -------------------------------------------------------------------------
    {
        id: "sa-01",
        type: "short_answer",
        subject: "English Math",
        topic: "Spelling & Calculation",
        question: "What is the English spelling of the number resulting from: (15 times 4) minus 10? Write the English word!",
        acceptableAnswers: ["fifty", "Fifty", "FIFTY"],
        hint: "Spelling starts with 'f' and has 5 letters.",
        explanation: "(15 * 4) = 60; 60 - 10 = 50. In English words: 'fifty'.",
        difficultyTarget: "medium",
        points: 120
    },
    {
        id: "sa-02",
        type: "short_answer",
        subject: "Mathematics",
        topic: "Algebra Basic",
        question: "Solve for x: 3x + 12 = 33. What is the value of x? (Type number)",
        acceptableAnswers: ["7", "x=7", "x = 7"],
        hint: "Subtract 12 from 33, then divide by 3.",
        explanation: "3x = 33 - 12 = 21 -> x = 21 / 3 = 7.",
        difficultyTarget: "easy",
        points: 100
    },

    // -------------------------------------------------------------------------
    // TYPE 4: MATCHING PAIRS (Menjodohkan)
    // -------------------------------------------------------------------------
    {
        id: "match-01",
        type: "matching",
        subject: "English Vocabulary",
        topic: "Math Operations & Terms",
        question: "Jodohkan istilah matematika bahasa Inggris dengan artinya yang tepat:",
        pairs: [
            { left: "Sum", right: "Hasil Penjumlahan (+)" },
            { left: "Difference", right: "Hasil Pengurangan (-)" },
            { left: "Product", right: "Hasil Perkalian (*)" },
            { left: "Quotient", right: "Hasil Pembagian (/)" }
        ],
        explanation: "Sum = Penjumlahan, Difference = Pengurangan, Product = Perkalian, Quotient = Pembagian.",
        difficultyTarget: "medium",
        points: 150
    },

    // -------------------------------------------------------------------------
    // TYPE 5: SEQUENCE ORDERING (Urutan Logika)
    // -------------------------------------------------------------------------
    {
        id: "order-01",
        type: "ordering",
        subject: "Mathematics",
        topic: "Order of Operations (PEMDAS)",
        question: "Urutkan hierarki operasi hitung matematika dari prioritas TERTINGGI ke TERENDAH (PEMDAS):",
        correctSequence: [
            "Parentheses (Tanda Kurung)",
            "Exponents (Pangkat / Akar)",
            "Multiplication & Division (Kali & Bagi)",
            "Addition & Subtraction (Tambah & Kurang)"
        ],
        explanation: "Aturan urutan operasi standar internasional adalah PEMDAS: Parentheses, Exponents, Multiplication & Division, Addition & Subtraction.",
        difficultyTarget: "hard",
        points: 150
    }
];

if (typeof window !== "undefined") {
    window.ZUPER_DEFAULT_QUESTIONS = ZUPER_DEFAULT_QUESTIONS;
}
