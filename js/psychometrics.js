/**
 * ZuperVerse - Psychometrics & Assessment Statistics Engine
 * Standards:
 * 1. Difficulty Index (P = B / N)
 * 2. Discrimination Index (D = (Upper27% - Lower27%) / n)
 * 3. Class Score Distribution (Mean, Median, StdDev, KKM 75%)
 * 4. Kurikulum Merdeka TP (Tujuan Pembelajaran) Mastery Mapping
 */

class PsychometricsEngine {
    constructor() {}

    /**
     * Calculate Item Difficulty (P)
     * @param {number} correctCount - Number of students answering correctly
     * @param {number} totalCount - Total students
     */
    calculateDifficulty(correctCount, totalCount) {
        if (!totalCount || totalCount <= 0) return { p: 0.5, category: "Sedang (Ideal)" };
        const p = correctCount / totalCount;
        let category = "Sedang (Ideal)";
        if (p > 0.70) category = "Mudah";
        else if (p < 0.30) category = "Sukar";
        return {
            p: parseFloat(p.toFixed(2)),
            category: category
        };
    }

    /**
     * Calculate Discrimination Index (D) using Upper 27% vs Lower 27% standard method
     * @param {Array<number>} upperScores - 1 if correct, 0 if wrong in top 27% students
     * @param {Array<number>} lowerScores - 1 if correct, 0 if wrong in bottom 27% students
     */
    calculateDiscrimination(upperScores, lowerScores) {
        const nUpper = upperScores.length;
        const nLower = lowerScores.length;
        const n = Math.max(nUpper, nLower, 1);

        const sumUpper = upperScores.reduce((acc, v) => acc + (v ? 1 : 0), 0);
        const sumLower = lowerScores.reduce((acc, v) => acc + (v ? 1 : 0), 0);

        const d = (sumUpper - sumLower) / n;
        let category = "Sangat Baik (Pertahankan)";
        let recommendation = "Sangat layak disimpan dalam Bank Soal Utama.";

        if (d >= 0.40) {
            category = "Sangat Baik";
            recommendation = "Daya pembeda prima, mampu membedakan siswa mahir dan belum mahir.";
        } else if (d >= 0.30) {
            category = "Baik";
            recommendation = "Soal baik, dapat langsung digunakan tanpa revisi.";
        } else if (d >= 0.20) {
            category = "Cukup";
            recommendation = "Daya pembeda cukup, evaluasi opsi pengecoh (distractor) agar lebih efektif.";
        } else {
            category = "Buruk / Jelek";
            recommendation = "Harus direvisi total atau diganti karena membingungkan siswa kelompok atas.";
        }

        return {
            d: parseFloat(d.toFixed(2)),
            category: category,
            recommendation: recommendation
        };
    }

    /**
     * Calculate Class Score Distribution
     * @param {Array<number>} scores - Array of student numeric scores
     * @param {number} kkm - Kriteria Ketercapaian Tujuan Pembelajaran (default 75)
     */
    calculateClassDistribution(scores, kkm = 75) {
        if (!scores || scores.length === 0) {
            return {
                totalStudents: 0,
                mean: 0,
                median: 0,
                stdDev: 0,
                highest: 0,
                lowest: 0,
                passCount: 0,
                failCount: 0,
                passRate: 0
            };
        }

        const sorted = [...scores].sort((a, b) => a - b);
        const N = sorted.length;
        const sum = sorted.reduce((acc, s) => acc + s, 0);
        const mean = sum / N;

        // Median
        let median = 0;
        const mid = Math.floor(N / 2);
        if (N % 2 === 0) {
            median = (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            median = sorted[mid];
        }

        // Standard Deviation
        const variance = sorted.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / N;
        const stdDev = Math.sqrt(variance);

        const passCount = sorted.filter(s => s >= kkm).length;
        const failCount = N - passCount;
        const passRate = (passCount / N) * 100;

        return {
            totalStudents: N,
            mean: parseFloat(mean.toFixed(1)),
            median: parseFloat(median.toFixed(1)),
            stdDev: parseFloat(stdDev.toFixed(1)),
            highest: sorted[N - 1],
            lowest: sorted[0],
            passCount: passCount,
            failCount: failCount,
            passRate: parseFloat(passRate.toFixed(1))
        };
    }

    /**
     * Map Curriculum Goals (Tujuan Pembelajaran - TP)
     */
    evaluateLearningObjectives(studentScore, accuracy, subject) {
        const tpList = [
            {
                code: "TP.01",
                topic: "Identifikasi & Pelafalan Angka Cardinal/Ordinal Bahasa Inggris",
                threshold: 70
            },
            {
                code: "TP.02",
                topic: "Operasi Hitung Aritmatika & Pecahan Desimal",
                threshold: 75
            },
            {
                code: "TP.03",
                topic: "Penyelesaian Masalah Soal Cerita Berhitung (Word Problems)",
                threshold: 80
            }
        ];

        return tpList.map(tp => {
            const isAchieved = studentScore >= tp.threshold;
            return {
                code: tp.code,
                topic: tp.topic,
                status: isAchieved ? "Tercapai Optimal" : "Perlu Bimbingan Tambahan",
                isAchieved: isAchieved
            };
        });
    }
}

window.psychometricsEngine = new PsychometricsEngine();
