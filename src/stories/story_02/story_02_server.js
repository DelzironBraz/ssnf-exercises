var numberToWordsScript = Class.create();
numberToWordsScript.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    convertNumber: function (price) {
        var price = this.getParameter("sysparm_price");
        if (!price || isNaN(price)) {
            gs.info("Invalid price value received in Script Include: " + price);
            return "Invalid number";
        }

        price = parseFloat(price);
        if (isNaN(price)) {
            gs.info("Failed to convert price to number: " + price);
            return "Invalid number";
        }

        gs.info("Price received: " + price);

        try {
            var soapMessage = new sn_ws.SOAPMessageV2();
            soapMessage.setEndpoint(
                "https://www.dataaccess.com/webservicesserver/numberconversion.wso"
            );
            soapMessage.setHttpMethod("POST");
            soapMessage.setRequestHeader(
                "Content-Type",
                "text/xml; charset=utf-8"
            );

            var soapBody =
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
                "<soap12:Body>" +
                '<NumberToDollars xmlns="http://www.dataaccess.com/webservicesserver/">' +
                "<dNum>" +
                price +
                "</dNum>" +
                "</NumberToDollars>" +
                "</soap12:Body>" +
                "</soap12:Envelope>";

            soapMessage.setRequestBody(soapBody);
            gs.info("Sending request with price: " + price);

            var response = soapMessage.execute();
            var responseBody = response.getBody();
            gs.info("Received response: " + responseBody);

            var xmlDoc = new XMLDocument(responseBody);
            var result = xmlDoc.getNodeText(
                "//*[local-name()='NumberToDollarsResult']"
            );

            if (result) {
                gs.info("Final result: " + result);
                return result;
            }

            gs.info("Failed to extract conversion result.");
            return "Conversion failed";
        } catch (ex) {
            gs.info("Error in SOAP call: " + ex.message);
            return "Error in SOAP call";
        }
    },

    type: "numberToWordsScript",
});
