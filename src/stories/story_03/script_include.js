var GetAvatar = Class.create();
GetAvatar.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    generateAvatar: function () {
        var sysId = this.getParameter("recordSysId");
        var avatarUrl = this.getParameter("avatarUrl");

        if (!sysId || !avatarUrl) {
            gs.error("Faltando parâmetros necessários: sys_id ou avatarUrl");
            return JSON.stringify({
                success: false,
                error: "Faltando parâmetros necessários: sys_id ou avatarUrl",
            });
        }

        try {
            var attachmentSysId = this.saveAvatarAsAttachment(sysId, avatarUrl);

            gs.info(
                "Avatar salvo com sucesso, attachmentSysId: " + attachmentSysId
            );

            return JSON.stringify({
                success: true,
                attachmentSysId: attachmentSysId,
            });
        } catch (e) {
            gs.error("Erro ao salvar o avatar: " + e.message);
            return JSON.stringify({
                success: false,
                error: "Erro ao salvar o avatar: " + e.message,
            });
        }
    },

    saveAvatarAsAttachment: function (recordSysId, avatarUrl) {
        var request = new sn_ws.RESTMessageV2();
        request.setHttpMethod("GET");
        request.setEndpoint(avatarUrl);

        request.saveResponseBodyAsAttachment(
            "u_avatars",
            recordSysId,
            "u_avatar"
        );

        var response = request.execute();
        var httpStatus = response.getStatusCode();

        if (httpStatus !== 200) {
            gs.error("Falha ao baixar o avatar. Status HTTP: " + httpStatus);
            throw new Error(
                "Falha ao baixar o avatar. Status HTTP: " + httpStatus
            );
        }

        var attachmentSysId = response.getResponseAttachmentSysid();

        if (!attachmentSysId) {
            throw new Error("Erro ao salvar o anexo. Nenhum sys_id retornado.");
        }

        return attachmentSysId;
    },
});
