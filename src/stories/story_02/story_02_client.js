function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }

    var price = g_form.getValue("price");
    console.log("Original price value: " + price);

    price = price.replace(/[^0-9.]/g, "");

    console.log("Price after cleaning: " + price);

    var numericPrice = parseFloat(price);
    console.log("Numeric price after conversion: " + numericPrice);

    if (isNaN(numericPrice)) {
        console.log("Invalid price value: " + price);
        g_form.setValue("cost", "");
        return;
    }

    var ga = new GlideAjax("numberToWordsScript");
    ga.addParam("sysparm_name", "convertNumber");
    ga.addParam("sysparm_price", numericPrice);

    ga.getXMLAnswer(function (response) {
        console.log("Received response from Include: " + response);

        if (response) {
            var result = response.trim();
            g_form.setValue("cost", result);
        } else {
            g_form.setValue("cost", "Conversion failed");
        }
    });
}
