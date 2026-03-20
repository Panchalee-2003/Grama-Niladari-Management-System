const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../../frontend/public/certificates");
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const files = [
    { name: "residence_and_character.pdf", title: "Residence and character Certificate" },
    { name: "income_certificate.pdf", title: "Income Certificate" },
    { name: "delayed_births.pdf", title: "Registration of delayed births" },
    { name: "medical_assistance.pdf", title: "Request for financial assistance from the President's fund for medical treatment" },
    { name: "housing_loan.pdf", title: "Application for obtaining housing loan funds" },
    { name: "death_of_pensioner.pdf", title: "Notification of the death of a pensioner" },
    { name: "voluntary_organizations.pdf", title: "Registration of voluntary organizations" }
];

files.forEach(f => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(path.join(outDir, f.name)));
    doc.fontSize(20).text(f.title, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("This is a placeholder blank form. Please replace with the official PDF.", { align: "center" });
    doc.end();
});

console.log("Created placeholder PDFs.");
