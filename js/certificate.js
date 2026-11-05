/**
 * ZuperVerse - Printable Student Certificate & Achievement Generator
 * Produces elegant, vector-grade certificates of achievement for students
 */

class CertificateGenerator {
    constructor() {}

    /**
     * Render Certificate Preview in Modal
     * @param {Object} data - { studentName, absen, score, rank, teacherName, schoolName, date }
     */
    generateHTML(data) {
        const studentName = data.studentName || "Siswa Teladan";
        const absen = data.absen ? `(No. Absen: ${data.absen})` : "";
        const score = data.score || 1000;
        const rank = data.rank ? `Peringkat #${data.rank}` : "Juara Kelas";
        const teacherName = data.teacherName || "Ir. Nor Anisa, S.Kom., M.Kom.";
        const schoolName = data.schoolName || "SMP Bintang Akademia";
        const dateStr = data.date || new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
        const certNumber = "ZV-" + Math.floor(100000 + Math.random() * 900000);

        return `
            <div id="printable-certificate" class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-8 md:p-12 rounded-3xl border-4 border-amber-400/80 shadow-2xl relative overflow-hidden font-sans max-w-3xl mx-auto my-4">
                <!-- Decorative Corner Ornaments -->
                <div class="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-amber-400"></div>
                <div class="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-amber-400"></div>
                <div class="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-amber-400"></div>
                <div class="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-amber-400"></div>

                <!-- Watermark Background -->
                <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl">
                    🪐
                </div>

                <div class="relative z-10 text-center space-y-5">
                    <!-- Header -->
                    <div class="space-y-1">
                        <div class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                            Official Certificate of Achievement
                        </div>
                        <h2 class="text-3xl md:text-4xl font-black text-amber-400 tracking-tight pt-2">
                            SERTIFIKAT PENGHARGAAN
                        </h2>
                        <p class="text-xs text-indigo-300 font-mono tracking-wider">Nomor Seri Sertifikasi: ${certNumber}</p>
                    </div>

                    <p class="text-xs md:text-sm text-slate-300 italic pt-2">
                        Sertifikat ini secara resmi dianugerahkan kepada:
                    </p>

                    <!-- Student Name -->
                    <div class="py-2 border-b-2 border-amber-400/50 max-w-lg mx-auto">
                        <h3 class="text-2xl md:text-4xl font-black text-white tracking-wide uppercase">
                            ${studentName}
                        </h3>
                        <p class="text-xs text-amber-300/80 font-bold mt-1">${absen} ${schoolName}</p>
                    </div>

                    <!-- Body Statement -->
                    <p class="text-xs md:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed pt-2">
                        Atas keberhasilan, dedikasi, dan pencapaian luar biasa dalam menyelesaikan seluruh tantangan gamifikasi 
                        <b>ZuperVerse 3D Metaverse Learning</b> dengan perolehan skor 
                        <span class="text-amber-400 font-bold">${score.toLocaleString()} Poin</span> dan meraih predikat <span class="text-emerald-400 font-bold">${rank}</span>.
                    </p>

                    <!-- Signatures & Golden Seal -->
                    <div class="grid grid-cols-2 gap-8 pt-8 max-w-lg mx-auto items-end">
                        <div class="text-center space-y-1">
                            <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-lg border-2 border-white">
                                🎖️
                            </div>
                            <span class="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">Verifikasi ZuperVerse</span>
                        </div>

                        <div class="text-center space-y-1">
                            <p class="text-xs text-slate-300">${dateStr}</p>
                            <div class="h-10 flex items-center justify-center italic text-sm text-indigo-300 font-serif border-b border-slate-600">
                                ✍️ Signed Digitally
                            </div>
                            <p class="font-bold text-xs text-white pt-1">${teacherName}</p>
                            <span class="text-[10px] text-slate-400 block">Guru Pengampu & Asesor Kelas</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    openCertificateModal(data) {
        let modal = document.getElementById("certificate-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "certificate-modal";
            modal.className = "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="max-w-4xl w-full space-y-4">
                <div class="flex justify-between items-center no-print">
                    <span class="text-sm font-bold text-amber-300">Pratinjau Sertifikat Kelulusan Siswa</span>
                    <div class="flex gap-2">
                        <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white text-xs shadow-md">
                            🖨️ Cetak / Simpan PDF
                        </button>
                        <button onclick="document.getElementById('certificate-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs">
                            Tutup
                        </button>
                    </div>
                </div>
                ${this.generateHTML(data)}
            </div>
        `;
        modal.classList.remove("hidden");
    }
}

window.certificateGenerator = new CertificateGenerator();
