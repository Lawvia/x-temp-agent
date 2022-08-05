const PDFMerger = require('pdf-merger-js');

var pdf = require('html-pdf');
const { flatMap } = require('mysql2/lib/constants/charset_encodings');
var options = { format: 'Letter' };
// di atas



ejs.renderFile(path.join(__dirname, '../../views/', "panels/ms_keuangan_print.ejs"), data, {}, function(err, str) {
    console.log("AOAOAOOAOA", str, err)
    if (err) return res.send(err);

    // str now contains your rendered html
    
    pdf.create(str, options).toFile('./report.pdf', async function(err, data) {
        if (err) return console.log(err);
        console.log(data); // { filename: '/app/businesscard.pdf' }
        //salam pembuka html
        let pembukaSalam = `<!DOCTYPE html>
        <html>
        <head>
        
          <meta charset="utf-8">
          <title>Letter</title>
          <style>* {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-size: 14pt;
          line-height: 1.5;
          box-sizing: border-box;
        }
        ::selection {
          background: #000;
          color: #fff;
        }
        @page {
          margin: 0;
        }
        
        letter {
          position: relative;
          display: block;
          background: #fff;
          width: 100%;
          height: 100%;
          padding: 90px;
        }
        letter:before,
        letter:after {
          position: absolute;
          content: "";
          left: 0;
          width: 5mm;
          height: 0;
          border-bottom: 1px solid #ccc;
        }
        letter:before {
          top: 105mm;
        }
        letter:after {
          top: 200mm;
        }
        address {
          font-style: normal;  
        }
        from {
          display: block;
          margin-bottom: 14pt;
        }
        from > * {
          font-size: 7pt;
        }
        from > *:after {
          content: "|";
          padding: 0 1pt 0 4pt;
        }
        from > *:last-child:after {
          display: none;
        }
        to {
          display: block;
        }
        header {
          position: absolute;
          top: 55mm;
        }
        main {
          position: absolute;
          top: 40mm;
        }
        subject {
          display: block;
          margin-bottom: 28pt;
          margin-right: 40mm;
          font-weight: 600;
        }
        date {
          position: absolute;
          top: 0;
          right: 0;
          margin-right: 90px;
        }
        text {
          display: block;
        }
        text p {
          margin-bottom: 14pt;
          margin-right: 90px;
        }
        /* Customize the CSS here */</style>
        
        </head>
        <body>
          <letter>
        
          <main>
            <subject contenteditable>Kepada yth <br>{nama_pt}<br><br> Di tempat</subject>
            <date contenteditable>Jakarta, 20. July 2022</date>
            <text contenteditable>
              <p>Salam Sejahtera</p><p>Pada tanggal 21-23 Agustus 2022  PT Sarana Kencana Mulya akan mengadakan undian kupon periode campaign januari – desember 2021 di Singapura.</p><p>Sehubungan dengan hal itu kami telah membagikan kupon undian dengan cetakan barcode yang berisi nomor kupon kepada seluruh dealer peserta campaign.</p><p>Pada lampiran surat ini kami sertakan daftar nomor kupon yang bapak / ibu terima.</p><p>Mohon agar kupon yang bapak / ibu terima  dicek apakah sudah sesuai dengan daftar pada lampiran </p><p>Apabila hasil pengundian kupon nanti ada kupon yang tidak sesuai  dengan daftar nomor kupon pada lampiran ini maka kupon tersebut kami anggap tidak sah.</p><p><br></p><p>Demikian surat ini kami sampaikan, atas perhatiannya kami ucapkan banyak terima Kasih</p>    </text>
            <signature>
              <closing contenteditable>Salam Sukses</closing><br><br><br>
              <name contenteditable>PT Sarana Kencana Mulya<br></name>
                    
                  </signature>
          </main>
        </letter>
        
        </body>
        </html>`
        pdf.create(pembukaSalam, options).toFile('./penutup.pdf',async function(err, data) {
            if (err) return console.log(err);
            console.log(data); // { filename: '/app/businesscard.pdf' }
            var merger = new PDFMerger();

            console.log("starting to mix")

            merger.add('./repogrt.pdf');  //merge all pages. parameter is the path to file and filename.
            merger.add('./penutup.pdf'); // merge only page 2

            await merger.save('./merged.pdf'); //save under given name and reset the internal document

                res.send(JSON.stringify({
                    data: {
                        message: "success generate"
                    },
                }))
            });
    });                
});