var ageScriptInclude = Class.create();
ageScriptInclude.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    checkAge: function () {
        var birthdate = this.getParameter("sysparm_birthdate");
        if (!birthdate) {
            gs.info("Data de nascimento não recebida!");
            return 0;
        }

        gs.info("Data recebida: " + birthdate);

        var birthDateObj = new GlideDate();
        birthDateObj.setValue(birthdate);

        var today = new GlideDate();
        var age = today.getYear() - birthDateObj.getYear();

        if (
            today.getMonth() < birthDateObj.getMonth() ||
            (today.getMonth() == birthDateObj.getMonth() &&
                today.getDayOfMonth() < birthDateObj.getDayOfMonth())
        ) {
            age--;
        }

        gs.info("Idade calculada: " + age);
        return age;
    },

    type: "ageScriptInclude",
});
