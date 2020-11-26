function updateFilter() {
    var filter = $("#filter-field").val() == "function" ? customFilter : $("#filter-field").val();

    if ($("#filter-field").val() == "function") {
        $("#filter-type").prop("disabled", true);
        $("#filter-value").prop("disabled", true);
    } else {
        $("#filter-type").prop("disabled", false);
        $("#filter-value").prop("disabled", false);
    }
    if (filter.toString() == 'dni' || filter.toString() == 'rut') {
        table.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
        if (table.getData(true).length == 0) {
            table.setFilter(filter + '2', $("#filter-type").val(), $("#filter-value").val());
        }
    } else {
        table.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
    }
}
//Update filters on value change
$("#filter-field, #filter-type").change(updateFilter);
$("#filter-value").keyup(updateFilter);

//Clear filters on "Clear Filters" button click
$("#filter-clear").click(function() {
    $("#filter-field").val("");
    $("#filter-type").val("");
    $("#filter-value").val("");
    table.deselectRow();
    table.clearFilter();
});

// Trigger download of data.xlsx file
$("#download-xlsx").click(function() {
    table.download("xlsx", "data.xlsx", {
        sheetName: "Reporte"
    });
});