<%

    //String[] jsClassNames = request.getParameter("jsClassNames");
    String[] jsClassNames = (String[])request.getAttribute("jsClassNames");

    if(jsClassNames == null) throw new Exception("jsClassNames == null");
    if(jsClassNames.length == 0) throw new Exception("jsClassNames.length == 0");

    String contextUrl = request.getParameter("contextUrl");
    //String defaultUrl = request.getParameter("defaultUrl");

    //String[] classNamesObfuscated = com.ispaces.os.servlet.InitServlet.obfuscator.obfuscate(jsClassNames);
    //String[] classNamesObfuscated = obfuscator.obfuscate(jsClassNames);
    //String[] classNamesObfuscated = com.ispaces.js.servlet.InitServlet.obfuscator.obfuscate(jsClassNames);
    String[] classNamesObfuscated = jsClassNames; // Temporary when ispaces obfuscator not present

    StringBuilder obfuscatedClassesBuilder = new StringBuilder();

    int x = 0;
    for(String classNameObfuscated: classNamesObfuscated) {

        if(x++ > 0) obfuscatedClassesBuilder.append(",");
        obfuscatedClassesBuilder.append(classNameObfuscated);
    }

    StringBuilder jsUrlBuilder = new StringBuilder();
    //jsUrlBuilder.append(contextUrl); // JavaScript URL from same context as ispaces-os.
    jsUrlBuilder.append(contextUrl); // JavaScript URL from same context as ispaces-os.
    //jsUrlBuilder.append("/obfus/");
    //jsUrlBuilder.append("/js-comma-separated/");
    jsUrlBuilder.append(obfuscatedClassesBuilder);
    jsUrlBuilder.append("?").append("obfus=false");
    jsUrlBuilder.append("&").append(new java.util.Date().getTime());
  
    /*
    if(extraParamsMap != null) {

        jsUrlBuilder.append("?");

        String key, value;
        for(Map.Entry<String, String> entry: extraParamsMap.entrySet()) {

            key = entry.getKey();
            value = entry.getValue();

            jsUrlBuilder.append(key).append("=").append(value).append("&");
        }

        jsUrlBuilder.append(new java.util.Date().getTime());
    }
    */

%>var jsUrl='<%= jsUrlBuilder.toString() %>';
