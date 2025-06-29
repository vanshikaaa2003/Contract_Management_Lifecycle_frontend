from flask import Flask, request, jsonify
from flask_cors import CORS
import docx
import spacy
import re
import logging

app = Flask(__name__)
# Enable CORS for all routes, allowing requests from http://localhost:8080
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/docx-to-text', methods=['POST'])
def docx_to_text():
    try:
        if 'file' not in request.files:
            logger.error("No file provided in request")
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        logger.info(f"Received file: {file.filename}")
        
        # Verify file is a .docx
        if not file.filename.endswith('.docx'):
            logger.error("Invalid file format, expected .docx")
            return jsonify({"error": "Invalid file format, expected .docx"}), 400
        
        # Read .docx file
        doc = docx.Document(file)
        text = '\n'.join([para.text for para in doc.paragraphs if para.text.strip()])
        
        if not text:
            logger.warning("No text extracted from document")
            return jsonify({"error": "No text found in document"}), 400
        
        logger.info("Text extracted successfully")
        return jsonify({"text": text})
    
    except Exception as e:
        logger.error(f"Error in docx-to-text: {str(e)}")
        return jsonify({"error": f"Failed to process document: {str(e)}"}), 500

@app.route('/extract', methods=['POST'])
def extract_metadata():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            logger.error("No text provided in request")
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text']
        logger.info("Received text for metadata extraction")
        
        # Load spaCy model
        nlp = spacy.load('en_core_web_sm')
        doc = nlp(text)
        
        # Initialize metadata structure
        metadata = {
            "ContractTitle": "Unknown",
            "PartiesInvolved": {
                "PartyA": {"Name": "", "Address": ""},
                "PartyB": {"Name": "", "Address": ""}
            },
            "ContractDate": "",
            "EffectiveDate": "",
            "ExpirationDate": "",
            "PaymentTerms": {
                "Amount": "",
                "Currency": "",
                "Frequency": "",
                "PaymentDueDate": ""
            },
            "NoticePeriod": "",
            "TerminationConditions": "",
            "GoverningLaw": "",
            "ConfidentialityClause": "",
            "RenewalTerms": {
                "AutoRenewal": "",
                "RenewalNoticePeriod": ""
            },
            "SpecialConditions": "",
            "Signatories": {
                "PartyA_Signatory": "",
                "PartyB_Signatory": ""
            }
        }
        
        # Extract contract title (e.g., first line or "AGREEMENT" pattern)
        title_match = re.search(r'^(AGREEMENT|CONTRACT)\s+.*$', text, re.IGNORECASE | re.MULTILINE)
        if title_match:
            metadata["ContractTitle"] = title_match.group(0).strip()
        
        # Extract parties (using spaCy for entity recognition)
        parties = []
        for ent in doc.ents:
            if ent.label_ == "PERSON" and ent.text not in parties:
                parties.append(ent.text)
            elif ent.label_ == "ORG" and "PartiesInvolved" in metadata:
                if not metadata["PartiesInvolved"]["PartyA"]["Name"]:
                    metadata["PartiesInvolved"]["PartyA"]["Name"] = ent.text
                elif not metadata["PartiesInvolved"]["PartyB"]["Name"]:
                    metadata["PartiesInvolved"]["PartyB"]["Name"] = ent.text
        
        # Extract addresses (simple regex for common address patterns)
        address_pattern = r'\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}\s*\d{5}'
        addresses = re.findall(address_pattern, text)
        if addresses:
            if len(addresses) > 0:
                metadata["PartiesInvolved"]["PartyA"]["Address"] = addresses[0]
            if len(addresses) > 1:
                metadata["PartiesInvolved"]["PartyB"]["Address"] = addresses[1]
        
        # Extract dates (e.g., "January 1, 2023" or "01/01/2023")
        date_pattern = r'\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\d{1,2}/\d{1,2}/\d{4})\b'
        dates = re.findall(date_pattern, text, re.IGNORECASE)
        if dates:
            if len(dates) > 0:
                metadata["ContractDate"] = dates[0]
            if len(dates) > 1:
                metadata["EffectiveDate"] = dates[1]
            if len(dates) > 2:
                metadata["ExpirationDate"] = dates[2]
        
        # Extract payment terms
        payment_pattern = r'\$\d+(?:\.\d{2})?\s*(?:per\s+(month|year|quarter))?'
        payment_match = re.search(payment_pattern, text, re.IGNORECASE)
        if payment_match:
            metadata["PaymentTerms"]["Amount"] = payment_match.group(0).split()[0]
            if payment_match.group(1):
                metadata["PaymentTerms"]["Frequency"] = payment_match.group(1).capitalize()
        
        # Extract governing law (e.g., "Governed by the laws of [State]")
        law_pattern = r'Governed by the laws of\s+([A-Za-z\s]+)'
        law_match = re.search(law_pattern, text, re.IGNORECASE)
        if law_match:
            metadata["GoverningLaw"] = law_match.group(1).strip()
        
        # Extract confidentiality clause
        if re.search(r'confidential|non-disclosure', text, re.IGNORECASE):
            metadata["ConfidentialityClause"] = "Present"
        
        # Extract renewal terms
        renewal_pattern = r'auto\s*renewal|renews\s*automatically'
        if re.search(renewal_pattern, text, re.IGNORECASE):
            metadata["RenewalTerms"]["AutoRenewal"] = "Yes"
        
        logger.info("Metadata extracted successfully")
        return jsonify(metadata)
    
    except Exception as e:
        logger.error(f"Error in extract_metadata: {str(e)}")
        return jsonify({"error": f"Failed to extract metadata: {str(e)}"}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server on 0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)