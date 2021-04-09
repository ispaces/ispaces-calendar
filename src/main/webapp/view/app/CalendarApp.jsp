<%--@ page language="java" session="false" --%>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.io.StringWriter" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
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
    if (serverUrl == null) serverUrl = "http://localhost:8080";
    if (contextUrl == null) contextUrl = "http://localhost:8080/ispaces-calendar";
%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<html>
  <head>
    <title>Ispaces Calendar</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="<%= contextUrl %>/view/css/CalendarApplication.css">
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
            , "ResizableHandle"
            , "DraggableHandle"
            , "DraggableApplication"
            , "WindowControl"
            , "Application"
            , "CalendarApplication"
          };
          //request.setAttribute("classNames", classNames);
          request.setAttribute("jsClassNames", classNames);
      %>

      //window['IspacesApplicationLoader'] = (function() {
      (function() {

          let started = false;
          let contextUrl='<%= contextUrl %>';
          let backendUrl='<%= backendUrl %>';

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
      <jsp:include page="/view/var_jsUrlNoObfus.jsp">
        <jsp:param name="contextUrl" value="<%= jsUrlBuilder.toString() %>" />
        <jsp:param name="obfuscate" value="false" />
      </jsp:include>

          let include=function(src) {
              alert('include('+src+')');
              var e = document.createElement('script');
              e.setAttribute('type', 'text/javascript');
              e.onload = e.onreadystatechange = loadedJs;
              e.setAttribute('src', src);
              document.getElementsByTagName('head')[0].appendChild(e);
          };
          let loadedJs = function() {
              alert('loadedJs()');
              if (!started) {
                  if (this.readyState) {
                      if (this.readyState=='loaded') {start()}
                  } else {
                      start();
                  }
              }
          };
          let start = function() {
              alert('start()');
              started = true;
              let config = {
                  'contextUrl': contextUrl
                , 'backendUrl': backendUrl
              };
              alert('Ispaces.CalendarApplication = ' + Ispaces.CalendarApplication);
              //Ispaces.ContactTracingApplication.start(config);
              Ispaces.CalendarApplication.start(config);
          };
          return {
              startApplication: function() {
                alert('startApplication()');
                //include(ispacesJavascriptUrl);
                include(jsUrl);
              }
          }
      })().startApplication();
</script>
</body>
</html>