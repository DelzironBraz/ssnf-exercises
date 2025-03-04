function getAvatar() {
    g_form.setValue("u_avatar", null);

    var sysId = g_form.getUniqueValue();
    var imageType = "image/png";

    var avatarUrl = `https://api.dicebear.com/9.x/pixel-art/png?seed=${
        Math.random() * 1000
    }`;

    var request = new XMLHttpRequest();
    request.open("GET", avatarUrl, true);
    request.setRequestHeader("Accept", imageType);
    request.responseType = "blob";

    request.onload = function () {
        if (request.status === 200) {
            var ga = new GlideAjax("GetAvatar");
            ga.addParam("sysparm_name", "generateAvatar");
            ga.addParam("recordSysId", sysId);
            ga.addParam("avatarUrl", avatarUrl);

            ga.getXMLAnswer(function (response) {
                console.log("Resposta do GlideAjax:", response);

                if (response) {
                    try {
                        var responseObj = JSON.parse(response);

                        if (responseObj.success) {
                            g_form.setValue(
                                "u_avatar",
                                responseObj.attachmentSysId
                            );
                            g_form.save();
                            g_form.addInfoMessage(
                                "Avatar gerado e salvo com sucesso!"
                            );
                        } else {
                            g_form.addErrorMessage(
                                "Erro ao salvar o avatar: " + responseObj.error
                            );
                        }
                    } catch (e) {
                        console.error("Erro ao analisar a resposta JSON:", e);
                        g_form.addErrorMessage(
                            "Erro ao processar a resposta do servidor."
                        );
                    }
                } else {
                    g_form.addErrorMessage(
                        "Erro ao processar a resposta do servidor."
                    );
                }
            });
        } else {
            g_form.addErrorMessage(
                "Erro ao gerar avatar: " + request.statusText
            );
        }
    };

    request.onerror = function () {
        g_form.addErrorMessage(
            "Erro na requisição. Verifique sua conexão com a internet."
        );
    };

    request.send();
}
