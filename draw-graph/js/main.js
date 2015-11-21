/* More about syntax: http://www.graphviz.org/doc/info/lang.html */
var parse = function(description) {
  if (typeof(description) == "undefined" ||
    description === "")
    return undefined;
  var lines = description.split("\n");
  var result = [];
  var directed = $("#graph_type").val() === "digraph";
  var sep = directed ? "->" : "--";
  var ignore_the_first_line = $("#first_line_checkbox").is(":checked");
  var use_labels = $("#use_labels_checkbox").is(":checked");
  for (var i in lines) {
    if (ignore_the_first_line) {
      ignore_the_first_line = false;
      continue;
    }
    var line = lines[i].trim();
    if (line.length < 1 || line[0] === "#") {
      continue;
    }
    var elems = line.split(/\s+/);
    if (elems.length < 2)
      return undefined;
    var from = elems[0];
    var to = elems[1];
    var edge = from + sep + to;
    if (use_labels && elems.length > 2)
      edge += "[label=\"" + elems[2] + "\"]";
    result.push(edge);
  }
  return (directed ? "digraph" : "graph") + "{" + result.join(";") + "}";
}

/* Query example: https://chart.googleapis.com/chart?cht=gv&chl=digraph{1->2;2->3;1->3;3->4;1->5} */
var render_service = "https://chart.googleapis.com/";
var previous_graph = "";

var chart_url = function(graph) {
  var result = render_service + "chart?cht=gv&chl=" + graph;
  /*console.log("url: " + result);*/
  return result;
}

var clear_error = function () {
  var small = $("#error_message");
  small.html("")
  small.removeClass("error");
}

var report_error = function(message) {
  var small = $("#error_message");
  small.html(message);
  small.addClass("error");
}

var render_chart = function(graph) {
  if (graph !== previous_graph) {
    $("#output").attr("src", chart_url(graph));
    previous_graph = graph;
  }
}

var show = function() {
  clear_error();
  var data = $("#data_area").val();
  var graph = parse(data);
  if (graph)
    render_chart(graph);
  else
    report_error("unable to parse data");
}

$(document).ready(function() {
  $("#show_button").click(show);
  $(window).keypress(function(event) {
    if (!(event.which == 13 && event.ctrlKey))
      return true;
    show();
    return false;
  });
});
