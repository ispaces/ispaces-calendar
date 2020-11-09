<%--@ page language="java" session="false" --%>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.io.StringWriter" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%--@ page import="com.ispaces.js.servlet.InitServlet" --%>
<%!
    org.apache.logging.log4j.Logger log;
    public void jspInit() { // Create static variables here.
        log = org.apache.logging.log4j.LogManager.getLogger();
        log.debug("jspInit()");
    }
%>
<%
    String serverUrl = (String)application.getAttribute("serverUrl");
    String contextUrl = (String)application.getAttribute("contextUrl");
    String backendUrl = (String)application.getAttribute("backendUrl");
%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<title>Ispaces Calendar</title>
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

.Calendar
{
  border: blue 1px solid;
<%--
  border: 0px;
--%>
}

.buttons .positive-notop0
{
  background:#D2E0FA;
  border-top:#fff 1px solid;
  border-left:#fff 1px solid;
  border-right:1px #5a5a5a solid;
  border-bottom:1px #5a5a5a solid;
  text-shadow:#fff 0px 1px 0, #333 0 -1px 0;
  color:#5A5A5A;
}

.buttons .positive-notop1
{
  background:#a5c0f5;
  border-top:#DAE3FB 1px solid;
  border-left:#DAE3FB 1px solid;
  border-right:1px #5a5a5a solid;
  border-bottom:1px #5a5a5a solid;
  text-shadow:#D2E0FA 0px 1px 0, #333 0 -1px 0;
  color:#5A5A5A;
}

.buttons .positive-notop12
{
  /*
  background:#a5c0f5 url(http://stage.ispaces.com/view/images/bump/dev/e5e9ef-fff-1x28a.gif) repeat;
  */
  background:#a5c0f5;
  border-top:#dae3fb 1px solid;
  border-left:1px #E0E7FC solid;
  border-right:1px #00618c solid;
  border-bottom:1px #00618c solid;
  color:#636563;
}

.buttons .topmenu
{
  background:#a5c0f5;
  border-top:#dae3fb 1px solid;
  border-left:1px #E0E7FC solid;
  border-right:1px #00618c solid;
  border-bottom:1px #00618c solid;
  color:#636563;
}

.buttons .topmenu-right
{
  /*
  background:#a5c0f5 url(http://stage.ispaces.com/view/images/arrow/blue/right.gif) no-repeat center center;
  */
  background:#a5c0f5;
  border-top:#dae3fb 1px solid;
  border-left:1px #E0E7FC solid;
  border-right:1px #00618c solid;
  border-bottom:1px #00618c solid;
  color:#636563;
}

.buttons .topmenu-right:hover
{
  /*
  background:#a5c0f5 url(http://stage.ispaces.com/view/images/arrow/blue/right-on.gif) no-repeat center center;
  */
  background:#a5c0f5;
  border-top:#dae3fb 1px solid;
  border-left:1px #E0E7FC solid;
  border-right:1px #00618c solid;
  border-bottom:1px #00618c solid;
  color:#636563;
}

.buttons .topmenu-left
{
  /*
  background:#a5c0f5 url(http://stage.ispaces.com/view/images/arrow/blue/left.gif) no-repeat center center;
  */
  background:#a5c0f5;
  border-top:#dae3fb 1px solid;
  border-left:1px #E0E7FC solid;
  border-right:1px #00618c solid;
  border-bottom:1px #00618c solid;
  color:#636563;
}

.buttons .topmenu-left:hover
{
  /*
  background:#a5c0f5 url(http://stage.ispaces.com/view/images/arrow/blue/left-on.gif) no-repeat center center;
  */
  background:#a5c0f5;
  border-top:#dae3fb 1px solid;
  border-left:1px #E0E7FC solid;
  border-right:1px #00618c solid;
  border-bottom:1px #00618c solid;
  color:#636563;
}


table.month
{
  width: 100%;
  height: 100%;
  /*
  */
  background-color: #ccc;
}

div.month-div
{
  border: red 1px solid;
}

table.month th
{
  color:#6c6c6c;
  background:#f0f3fe;
  font-weight:bold;
  font-size:14px;
}

table.month td.weekend
{
  background:#ebeffe;
}

table.month td.weekend-on
{
  background:#ffcc00;
  color:#fff;
}

table.month td.today
{
  background:#fffccc;
}

/*
*/
table.month td, table.month td.off
{
  background:#fff;
}
</style>
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
    String[] classNames = {
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
    request.setAttribute("classNames", classNames);
%>

window['IspacesApplicationLoader'] = (function() {

    var started = false;
    var contextUrl = '<%= contextUrl %>';
    var backendUrl = '<%= backendUrl %>';
    <%--
    var ispacesUrl = '<%= ispacesUrl %>';
    --%>

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
        if (!started) {
            if (this.readyState) {  // fix for IE
                if (this.readyState == 'loaded') { start() }
            } else {
                start();
            }
        }
    };
    

    var start = function() {
        //alert('run()');
        started = true;
        var config = {
            'contextUrl': contextUrl
          , 'backendUrl': backendUrl
          <%--
          , 'ispacesServletUrl': '<%= ispacesUrlBuilder.toString() %>'
          //, 'ISPACES_SERVER_URL': '<%= ispacesUrlBuilder.toString() %>'
          , 'ispacesContextUrl': '<%= ispacesContextUrl %>'
          , 'classNames': classNames
          --%>
        };
        //ClassManager.start(config);
        Ispaces.Calendar.start(config);
    };

    return {
        startApplication: function() {
            include(ispacesJavascriptUrl);
        }
        , contextUrl: contextUrl
        <%--
        , ispacesServletUrl: '<%= ispacesUrlBuilder.toString() %>'
        , ispacesContextUrl: '<%= ispacesContextUrl %>'
        , ISPACES_SERVER_URL: '<%= ispacesUrlBuilder.toString() %>'
        , classNames: classNames
        --%>
    }
})();
window['IspacesApplicationLoader'].startApplication();
</script>
</body>
</html>