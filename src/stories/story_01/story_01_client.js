function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === "") {
        return;
    }

    console.log("Client Script newValue: " + newValue);

    var gaAge = new GlideAjax("ageScriptInclude");
    gaAge.addParam("sysparm_name", "checkAge");
    gaAge.addParam("sysparm_birthdate", newValue);
    gaAge.getXMLAnswer(function (response) {
        console.log("Resposta da idade: " + response);
        if (response) {
            var idadeInteira = parseInt(response, 10);
            g_form.setValue("u_age", idadeInteira);
        }
    });
}
