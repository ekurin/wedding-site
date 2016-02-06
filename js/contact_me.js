$(function() {

    /* jqBootstrapValidator don't work with bootstrap 3
       since control-group is renamed to form-group in BS 3
    */
    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var attending = $("#attending input:checked").val();
            var name = $("input#name").val();
            var namePartner = $("input#name-partner").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var allergies = $("input#allergies").val();
            var allergiesPartner = $("input#allergies-partner").val();
            var message = $("textarea#message").val();
            var fridayAttend = $("input#attending-friday").is(':checked');
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "https://docs.google.com/forms/d/1sV6FhRoBHfmvg4wZrP4qzgoZOa18ualYlYGZ0oMiX8A/formResponse",
                type: "POST",
                data: {
                    "entry.1167379487": attending,
                    "entry.400846965": name,
                    "entry.408869072": namePartner,
                    "entry.1283878840": email,
                    "entry.182502062": phone,
                    "entry.1305681393": allergies,
                    "entry.1054903899": allergiesPartner,
                    "entry.1286098234": message,
                    "entry.296385398": fridayAttend
                },
                dataType: "xml",
                cache: false,
                statusCode: {
                    // Google Forms return status 0 when POST completes
                    0: function() {
                        sucessHandler();
                    }
                },
                success: sucessHandler = function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Tack för din anmälan " + firstName + " </strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                    $('#contactForm').remove();
                },
                error: function(xhr, textStatus, errorThrown) {
                    // Google Forms return status 0 when POST completes
                    if (xhr.status == 0) { return;}
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
