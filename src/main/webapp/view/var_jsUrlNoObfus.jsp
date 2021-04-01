<%

    String[] classNames = (String[])request.getAttribute("classNames");
    if(classNames == null) throw new Exception("classNames == null");
    if(classNames.length == 0) throw new Exception("classNames.length == 0");
    String contextUrl = request.getParameter("contextUrl");
    //String[] classNamesObfuscated = com.ispaces.os.servlet.InitServlet.obfuscator.obfuscate(classNames);
    //String[] classNamesObfuscated = obfuscator.obfuscate(classNames);
    //String[] classNamesObfuscated = com.ispaces.js.servlet.InitServlet.obfuscator.obfuscate(classNames);
    String[] classNamesObfuscated = classNames; // Temporary when ispaces obfuscator not present
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
%>var ispacesJavascriptUrl='<%= jsUrlBuilder.toString() %>';
