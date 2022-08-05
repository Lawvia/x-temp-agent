const express = require('express')
const router = express.Router()
let ejs = require("ejs");
const xl = require('excel4node');
const path = require('path')
const model = require('../../models/model_kelas')
const model_umat = require('../../models/model_umat')
const model_apps = require('../../models/model_application')
const model_tahun = require('../../models/model_tahun')
const model_daerah = require('../../models/model_daerah')
const model_waktu = require('../../models/model_waktu')
const model_user = require('../../models/model_ms_panel_users');
const model_divisi = require('../../models/model_divisi');
const PDFMerger = require('pdf-merger-js');

var pdf = require('html-pdf');
const { flatMap } = require('mysql2/lib/constants/charset_encodings');
var options = { format: 'A4' };

router.use(function(req, res, next) {
    res.locals.message_success = req.flash('message_success');
    res.locals.message_fail = req.flash('message_fail');
    res.locals.message_warning = req.flash('message_warning');
    next()
}),

router.get("/", async function (req, res) {
    // var result = groups.list
    var [apps, err] = await model_apps.getAll();
    res.render('panels/ms_kelas', { user: req.user, apps: apps})
})

// ajaxList
router.post("/list", async function(req, res) {
    var start = req.body.start
    var length = req.body.length
    var order = req.body.columns[req.body.order[0].column].data
    var direction = req.body.order[0].dir
    var search = req.body.search.value
    var [ret, err] = await model.getList({
        start: parseInt(start),
        length: parseInt(length),
        search: search,
        order: order,
        direction: direction,
        id: req.body.id,
    })
    var [count, err] = await model.count({
        start: parseInt(start),
        length: parseInt(length),
        search: search,
        order: order,
        direction: direction,
        id: req.body.id,
    })
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        data : ret,
        recordsTotal:count,
        recordsFiltered:count,
    }));
}),

router.post("/get", async function(req,res) {
    var [result,error] = await model.getById(req.body.app_id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        data:result,
    }))
}),

router.post("/get_user", async function(req,res) {
    var [result,error] = await model.getUserList(req.body.app_id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        data:result,
    }))
}),

router.post("/input", async function(req, res) {
   var id_vihara = req.body.id_vihara
   var nama_kelas = req.body.nama_kelas
   var keterangan = req.body.keterangan
   var tanggal_kelas = req.body.tanggal_kelas
   var tanggal_selesai = req.body.tanggal_selesai
   var id_kelas = req.body.id_kelas
   var sidang_dharma = req.body.sidang

   console.log("sidang", sidang_dharma)
   if (!sidang_dharma){
       sidang_dharma = 0
   }else{
       sidang_dharma = 1
   }
   console.log("ss",sidang_dharma)

    var data_input = {
        id_vihara: id_vihara,
        nama_kelas: nama_kelas,
        keterangan: keterangan,
        tanggal_kelas: tanggal_kelas,
        tanggal_selesai: tanggal_selesai,
        id_kelas: id_kelas,
        sidang_dharma: sidang_dharma
    }
    console.log("kelas ", data_input)
    if (!id_kelas || id_kelas == 0) {//insert

        var [result, error] = await model.addApps(data_input);
        req.flash('message_success', "Success insert data")
        res.redirect('/panels/kelas')
    } else {//update

        var [result, error] = await model.updateApps(data_input);
        req.flash('message_success', "Success update data")
        res.redirect('/panels/kelas')
    }
})


router.get("/peserta/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_kelas = req.params.id_cetya
    var [result,error] = await model.getById(id_kelas);

    var [apps, err] = await model_apps.getAll();
    var [pengajak, err] = await model_umat.getAll();
    var [daerah, err] = await model_daerah.getAll();

    var [peserta, err] = await model.getPesertaKelas(id_kelas,"all");
    console.log("pes", peserta)

    var [countMale, err] = await model.getCountPeserta(id_kelas,"m");
    var [countFemale, err] = await model.getCountPeserta(id_kelas,"f");
    console.log("c", countFemale.count)

    res.render('panels/ms_peserta', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        peserta: peserta,
        countFemale: countFemale.count,
        countMale: countMale.count,
        daerah: daerah
    })
})

router.get("/donatur/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_kelas = req.params.id_cetya
    var [result,error] = await model.getById(id_kelas);

    var [apps, err] = await model_apps.getAll();
    var [pengajak, err] = await model_umat.getAll();

    var [donatur, err] = await model.getDonaturKelas(id_kelas);
    console.log("pes", donatur)

    res.render('panels/ms_donatur', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        donatur: donatur
    })
})

router.get("/pengabdi/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_kelas = req.params.id_cetya
    var [result,error] = await model.getById(id_kelas);

    var [apps, err] = await model_apps.getAll();
    var [pengajak, err] = await model_umat.getAll();

    var [pengabdi, err] = await model.getPengabdiKelas(id_kelas,"all");
    console.log("pes", pengabdi)

    var [countMale, err] = await model.getCountPengabdi(id_kelas,"m");
    var [countFemale, err] = await model.getCountPengabdi(id_kelas,"f");
    console.log("c", countFemale.count)

    res.render('panels/ms_pengabdi', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        pengabdi: pengabdi,
        countFemale: countFemale.count,
        countMale: countMale.count
    })
})

router.get("/keuangan/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_kelas = req.params.id_cetya
    var [result,error] = await model.getById(id_kelas);
    var [divisi, err] = await model_divisi.getAll();


    var [count, err] = await model.getCountPesertaKelas(id_kelas);
    var [sumbanganPe, err] = await model.getTotalSumbanganPeserta(id_kelas);
    var [sumbanganDo, err] = await model.getTotalSumbanganDonatur(id_kelas);
    var [sumbanganDi, err] = await model.getTotalSumbanganPengabdi(id_kelas);
    var [costDivisi, err] = await model.getTotalPengeluaranDivisi(id_kelas);
    var [totalcost, err] = await model.getTotalPengeluaran(id_kelas);

    console.log("pes", costDivisi)

    res.render('panels/ms_keuangan', { 
        user: req.user,
        result: result,
        divisi: divisi,
        count : count[0],
        sumbanganPe: sumbanganPe[0],
        sumbanganDi: sumbanganDi[0],
        sumbanganDo: sumbanganDo[0],
        costDivisi: costDivisi,
        totalcost: totalcost[0]
    })
})

router.post("/api_key", async function(req,res) {

    var id_kelas = 2
    var [result,error] = await model.getById(id_kelas);
    var [divisi, err] = await model_divisi.getAll();


    var [count, err] = await model.getCountPesertaKelas(id_kelas);
    var [sumbanganPe, err] = await model.getTotalSumbanganPeserta(id_kelas);
    var [sumbanganDo, err] = await model.getTotalSumbanganDonatur(id_kelas);
    var [sumbanganDi, err] = await model.getTotalSumbanganPengabdi(id_kelas);
    var [costDivisi, err] = await model.getTotalPengeluaranDivisi(id_kelas);
    var [totalcost, err] = await model.getTotalPengeluaran(id_kelas);

    var data = { 
        user: req.user,
        result: result,
        divisi: divisi,
        count : count[0],
        sumbanganPe: sumbanganPe[0],
        sumbanganDi: sumbanganDi[0],
        sumbanganDo: sumbanganDo[0],
        costDivisi: costDivisi,
        totalcost: totalcost[0]
    }
    console.log("ccccc", path.join(__dirname, './app/views/', "panels/ms_keuangan_print"))
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

                merger.add('./report.pdf');  //merge all pages. parameter is the path to file and filename.
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

    
}),

router.get("/print/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_kelas = req.params.id_cetya
    var [result,error] = await model.getById(id_kelas);
    var [divisi, err] = await model_divisi.getAll();


    var [count, err] = await model.getCountPesertaKelas(id_kelas);
    var [sumbanganPe, err] = await model.getTotalSumbanganPeserta(id_kelas);
    var [sumbanganDo, err] = await model.getTotalSumbanganDonatur(id_kelas);
    var [sumbanganDi, err] = await model.getTotalSumbanganPengabdi(id_kelas);
    var [costDivisi, err] = await model.getTotalPengeluaranDivisi(id_kelas);
    var [totalcost, err] = await model.getTotalPengeluaran(id_kelas);

    console.log("pes", costDivisi)

    res.render('panels/ms_keuangan_print', { 
        user: req.user,
        result: result,
        divisi: divisi,
        count : count[0],
        sumbanganPe: sumbanganPe[0],
        sumbanganDi: sumbanganDi[0],
        sumbanganDo: sumbanganDo[0],
        costDivisi: costDivisi,
        totalcost: totalcost[0]
    })
})

router.get("/sumbangan/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_kelas = req.params.id_cetya
    var [result,error] = await model.getById(id_kelas);

    var [apps, err] = await model_apps.getAll();
    var [pengajak, err] = await model_umat.getAll();

    var [sumbangan, err] = await model.getSumbanganKelas(id_kelas);
    console.log("pes", sumbangan)

    res.render('panels/ms_sumbangan', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        sumbangan: sumbangan
    })
})

router.get("/biaya/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_kelas = req.params.id_cetya
    var [result,error] = await model.getById(id_kelas);

    var [apps, err] = await model_apps.getAll();
    var [pengajak, err] = await model_umat.getAll();
    var [divisi, err] = await model_divisi.getAll();

    var [biaya, err] = await model.getBiayaKelas(id_kelas);
    console.log("pes", biaya)

    res.render('panels/ms_biaya', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        biaya: biaya,
        divisi: divisi
    })
})

router.get("/add", async function (req, res) {
    // get app list by user id
   var result = {
       id : 0,
       nama_cetya: "",
       alamat: "",
       no_kontak: "",
       id_umat1: 0,
       id_umat2: 0,
       active: 0,
   }

        var [apps, err] = await model_apps.getAll();
        var [pengajak, err] = await model_umat.getAll();

    res.render('panels/ms_cetya', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        // phone: phone,
        // groups: groups,
        // scene: scene,
        // templates: templates
    })
})

//delete
router.post('/delete', async function (req, res){
    var [curr, err]= await model.delete(req.body.id_app)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        status: "SUCCESS"
    }));
})

router.post('/downloadpeserta', async function (req, res){
    var [peserta, err] = await model.getDownloadPeserta(req.body.id_kelas,"m");
    var [wanita, err] = await model.getDownloadPeserta(req.body.id_kelas,"f");
    console.log("pes", wanita)

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Peserta Pria');
    const ww = wb.addWorksheet('Peserta Wanita');
    const headingColumnNames = [
        "Nama Mandarin",
        "Nama Indonesia",
        "No Chutao",
        "Sumbangan",
        "Cara Bayar",
        "Transportasi"
    ]

    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });

    let headingColumnIndexW = 1;
    headingColumnNames.forEach(heading => {
        ww.cell(1, headingColumnIndexW++)
            .string(heading)
    });

    let rowIndex = 2;
    peserta.forEach( record => {
        let columnIndex = 1;
        Object.keys(record ).forEach(columnName =>{
            ws.cell(rowIndex,columnIndex++)
                .string(record [columnName])
        });
        rowIndex++;
    });

    let rowIndexW = 2;
    wanita.forEach( recordW => {
        let columnIndexW = 1;
        Object.keys(recordW ).forEach(columnNameW =>{
            ww.cell(rowIndexW,columnIndexW++)
                .string(recordW[columnNameW])
        });
        rowIndexW++;
    });



    var tempPath = path.join(__dirname, '../../../public/')+"peserta.xlsx"
    wb.write(tempPath);


    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        status: "SUCCESS"
    }));
})


module.exports = router

