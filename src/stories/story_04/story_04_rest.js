(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
    var requestBody = request.body.data;
    var tag = requestBody.tag;
    var person = requestBody.person;
    var message = requestBody.message;
    var ranking = requestBody.ranking;
    var email = requestBody.email;

    if (!tag || !person) {
        response.setStatus(400);
        return response.setBody({
            error: "Fields 'tag' and 'person' are required.",
        });
    }

    if (tag !== "SN") {
        response.setStatus(200);
        return response.setBody({
            message: "Tag does not match 'SN'. Feedback ignored.",
        });
    }

    var userRecord = new GlideRecord("sys_user");
    userRecord.addQuery("email", person);
    userRecord.query();

    if (!userRecord.next()) {
        response.setStatus(200);
        return response.setBody({
            message:
                "Person email is not a registered ServiceNow user. Feedback ignored.",
        });
    }

    var feedbackRecord = new GlideRecord("u_person_feedback");
    feedbackRecord.initialize();
    feedbackRecord.u_employee = person;
    feedbackRecord.u_comment = message;
    feedbackRecord.u_note = ranking;
    feedbackRecord.u_posting_by = email;
    feedbackRecord.insert();

    response.setStatus(201);
    response.setBody({
        message:
            "Feedback received from '" +
            email +
            "' to '" +
            person +
            "'. Thank you!",
    });
})(request, response);
