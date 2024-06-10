const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const auth = require("../services/authentication");
const ejs = require("ejs");
const connection = require("../connection");
const express = require('express');
const router = express.Router();

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
   
    const productDetailsReport = JSON.parse(orderDetails.productDetails);

    const totalAmount = orderDetails.totalAmount || 0; // Ensure default to 0 if totalAmount is null

    const query = "INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (err) {
            console.error("Database insertion error:", err);
            return res.status(500).json({ error: "Database insertion error" });
        }

        // Render the EJS template
        ejs.renderFile(path.join(__dirname, 'report.ejs'), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount
        }, (err, html) => {
            if (err) {
                console.error("EJS rendering error:", err);
                return res.status(500).json({ error: "EJS rendering error" });
            }

            // Generate PDF from HTML
            const options = { format: 'A4' };
            pdf.create(html, options).toFile(path.join(__dirname, `../generated_pdf/${generatedUuid}.pdf`), (err, data) => {
                if (err) {
                    console.error("PDF generation error:", err);
                    return res.status(500).json({ error: "PDF generation error" });
                }
                return res.status(200).json({ uuid: generatedUuid });
            });
        });
    });
});

router.post('/getPdf', auth.authenticateToken, function (req, res) {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';

    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    } else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, 'report.ejs'), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.total
        }, (err, results) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                pdf.create(results).toFile(pdfPath, function (err, data) {
                    if (err) {
                        console.error("PDF generation error:", err);
                        return res.status(500).json({ error: "PDF generation error" });
                    } else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                });
            }
        });
    }
});

router.get('/getBills', auth.authenticateToken, (req, res, next) => {
    const query = "SELECT * FROM bill ORDER BY id DESC";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
    });
});


router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    const query = "DELETE FROM bill WHERE id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Bill id not found" });
            }
            return res.status(200).json({ message: "Bill deleted successfully" });
        } else {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
    });
});

module.exports = router;
