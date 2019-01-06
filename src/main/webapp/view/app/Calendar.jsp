<%--@ page language="java" session="false" --%>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.io.StringWriter" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.ispaces.js.servlet.InitServlet" %>

<%!
    org.apache.logging.log4j.Logger logger;
    
    public void jspInit() { // Create static variables here.
        logger = org.apache.logging.log4j.LogManager.getLogger();
        logger.debug("jspInit()");
    } // end jspInit() method
%>

<%
    String serverUrl = (String)application.getAttribute("serverUrl");
    //String contextUrl = InitServlet.properties.getProperty("contextUrl");
    String contextUrl = (String)application.getAttribute("contextUrl");
    String backendUrl = (String)application.getAttribute("backendUrl");

%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!doctype html>

<html>

<head>
<title>Instagram API Browser</title>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />

<style type="text/css">
html,body
{
  height:100%;
}

body
{
  background-color:#fff;
  margin:0;
  height:100%;
  font-family:arial;
  font-size:13px;
}

.div-header
{
<%--
  border: 0px;
  border: #000 1px solid;
--%>
  margin-right:10px;
}

.window-title
{
<%--
  border: 0px;
  border: #999 1px solid;
  padding: 6px 12px;
--%>
  border: 0px;
  background-color: #4169E1;
  background-color:#fff;
  color: #fff;
  color: #000;
  font-size:20px;
}

.output
{
  font-size:15px;
  padding: 10px;
<%--
  border: #000 1px solid;
  border: #4169E1 1px solid;
  background-color: #4169E1;
  color: #fff;
  background-color:#fff;
  color: #000;
--%>
}

.InstagramApiBrowser
{
<%--
  border: blue 1px solid;
  border: 0px;
--%>
}

.instagram-api-widget
{
<%--
  border: 0px;
  border: #000 1px solid;
  border: #4169E1 1px solid;
  width:100%;
  border: #000 1px solid;
--%>
  height: 30px;
  padding:2px;
}

.instagram-api-widget .cell-base-url
{
<%--
  border: black 1px solid;
  border: 0px;
--%>
  vertical-align: middle;
  margin: auto;
  font-size:20px;
  padding-left:10px;
  white-space: nowrap;
}

.instagram-api-widget .cell-forward-slash
{
<%--
  border: black 1px solid;
  border: 0px;
  border: red 1px solid;
--%>
  vertical-align: middle;
  margin: auto;
  height: 30px;
  font-size:20px;
  padding-left:0px;
}

.instagram-api-widget .cell-select-endpoint
{
<%--
  border: black 1px solid;
  border: 0px;
  border: red 1px solid;
--%>
  border: 0px;
  vertical-align: top;
  height: 30px;
  width: 100px;
  margin: auto;
  position: relative;
}

ul.select
{
  position: relative;
<%--
  border: 0px;
  border: red 1px solid;
  border: 0px;
--%>
  text-align:left;
  vertical-align:top;
  padding-left:0px;
  margin:0px;
  margin-top: 0px;
  margin-left: 0px;
  padding-top: 0px;
  padding-left: 1px;
  height: 28px;
}

ul.select li
{
  display: none;
  cursor: default;
  white-space: nowrap;
  vertical-align: top;
  margin-top: 0px;
  margin-left: 0px;
  padding-top: 0px;
  padding-left: 0px;
  font-size: 15px;
  font-weight: 500;
<%--
  border: red 1px solid;
  padding-right: 3px;
  padding-left: 3px;
--%>
}

ul.select li.selected
{
<%--
  border: blue 1px solid;
  margin-left: 1px;
  padding-right: 3px;
  padding-left: 3px;
  padding: 0px;
--%>
  border: transparent 1px solid;
  display: block;
  vertical-align: top;
  background-color: #fff;
  height: 28px;
  line-height: 28px;
  color: #000;
  font-size:20px;
}

ul.select li.selected:hover
{
  border: #ccc 1px solid;
}

<%--
U+25BC BLACK DOWN-POINTING TRIANGLE
U+25BE SMALL BLACK DOWN-POINTING TRIANGLE
--%>
ul.select li.selected:after
{
  content: "\25BE";
<%--
  border: green 1px solid;
  font-family:ispaces;
  font-size:5px;
  content:'v';
  margin: auto;
  margin: auto 2px auto 2px;
  margin: auto 1px auto 1px;
--%>
  margin: auto 2px auto 2px;
  border: #ccc 1px solid;
  vertical-align: middle;
  text-align: center;
  display:inline-block;
  height:18px;
  min-height:18px;
  width:18px;
  min-width:18px;
  line-height:18px;
}

ul.select-open
{
  position: absolute;
  margin:0px;
  padding:0px;
  padding-left:0px;
  text-align:left;
  vertical-align:top;
  color: #4169E1;
  /*
  color:rgb(65, 105, 225);
  border: red 1px solid;
  */
  border: #000 1px solid;
  font-weight: normal;
  font-family: arial;
  <%--= boxShadow3_25 --%>
}

ul.select-open li
{
  display: block;
  cursor: pointer;
  text-align: left;
  display: block;
  vertical-align: top;
  background-color: #fff;
  height: 28px;
  line-height: 28px;
  color: #000;
  /*
  margin-left: 0px;
  */
  margin: 0px;        
  padding: 0px;
  padding-left: 3px;
  font-size:20px;
}

.instagram-button
{
<%--
  border: 0px;
  padding:0px 10px;
--%>
  border: #666 1px solid;
  vertical-align: middle;
  margin: auto;
  font-size:20px;
  white-space: nowrap;
  cursor: pointer;
}

.large-button
{
<%--
  border: black 1px solid;
  border: 0px;
  padding:0px 10px;
--%>
  vertical-align: middle;
  margin: auto;
  font-size:20px;
  white-space: nowrap;
  cursor: pointer;
}

@media (max-width: 767) {
    /* your custom css class on a parent will increase specificity */
    /* so this rule will override Bootstrap's font size setting */
    .autosized .label { font-size: 14px; }
}

@media (min-width: 768px) and (max-width: 991px) {
    .autosized .label { font-size: 16px; }
}

@media (min-width: 992px) and (max-width: 1199px) {
    .autosized .label { font-size: 18px; }
}

@media (min-width: 1200px) {
    .autosized .label { font-size: 20px; }
}
</style>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

</head>
<body>
<script type="text/javascript">

<%

    Map<String, String> extraParamsMap = new HashMap<String, String>() {
      {
        put("min", "false");
        put("obfus", "true");
        put("cache", "false");
        put("log", "true");
      }
    };

    String[] jsClassNames = {
        "StandaloneApp"
      , "Constants"
      , "Common"
      , "Create"
      , "Events"
      , "ExtendArray" // Required by StringBuilder.addAll().
      , "ExtendNode"
      , "ExtendElement"
      , "ExtendSvgElement" // Required by the Spinner
      , "Classes"
      , "Hashtable"
      , "StopWatch"
      , "Ajax"
      , "Svg"
      , "Select"
      , "StringBuilder"
      , "AsyncCaller" // Required by the Spinner
      , "ResizableWindow"
      , "WindowControl"
      , "Calendar"
    };

    request.setAttribute("jsClassNames", jsClassNames);
%>

(function() {

    var started=false;
    var contextUrl='<%= contextUrl %>';
    var backendUrl='<%= backendUrl %>';

<%

    StringBuilder jsUrlBuilder = new StringBuilder();

    //jsUrlBuilder.append(contextUrl); // JavaScript URL from same context as ispaces-os.
    jsUrlBuilder.append(serverUrl); // JavaScript URL from same context as ispaces-os.

    // Append context path
    //jsUrlBuilder.append("/ispaces");
    //jsUrlBuilder.append("/javapoets");
    //jsUrlBuilder.append("/instagram-api-browser");
    jsUrlBuilder.append("/js"); // js context

    // Append servlet path
    jsUrlBuilder.append("/js-comma-separated/"); // js-comma-separated servlet
    //jsUrlBuilder.append("/Constants.js");
    //jsUrlBuilder.append(obfuscatedClassesBuilder);
    //jsUrlBuilder.append("?");
    //jsUrlBuilder.append(new java.util.Date().getTime());
%>

<%--
    var jsUrl='<%= jsUrlBuilder.toString() %>';
      <jsp:param value="<%= contextUrl %>" name="contextUrl" />
--%>
    <jsp:include page="/view/var_jsUrlNoObfus.jsp">
      <jsp:param value="<%= jsUrlBuilder.toString() %>" name="contextUrl" />
    </jsp:include>

    var include=function(src) {
        //alert('include('+src+')');
        var e = document.createElement('script');
        e.setAttribute('type', 'text/javascript');
        e.onload = e.onreadystatechange = loadedJs;
        e.setAttribute('src', src);
        document.getElementsByTagName('head')[0].appendChild(e);
    };

    var loadedJs=function() {
        if(!started) {
            if(this.readyState) {
                if(this.readyState=='loaded'){run()}
            } else {
                run();
            }
        }
    };

    var run = function() {
        //alert('run()');

        started=true;

        var config = {
            'contextUrl': contextUrl
          , 'backendUrl': backendUrl
        };

        //alert('InstagramApiBrowser = '+InstagramApiBrowser);
        Ispaces.Calendar.start(config);
    };

    return {

        startApp: function() {
          //alert('startApp()');

          include(jsUrl);
        }
    }

})().startApp();

</script>

</body>
</html>
