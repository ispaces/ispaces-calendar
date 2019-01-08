<%

    String serverUrl = (String)application.getAttribute("serverUrl");
    String contextUrl = (String)application.getAttribute("contextUrl");
    String backendUrl = (String)application.getAttribute("backendUrl");

%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!doctype html>

<html>

    <head>
        <title></title>
    </head>

    <body>
      <ul>
        <li><a href="/app/Calendar">/app/Calendar</a></li>
        <li><a href="<%= contextUrl %>/view/app/Calendar.jsp"><%= contextUrl %>/view/app/Calendar.jsp</a></li>
      </ul>
    </body>

</html>
