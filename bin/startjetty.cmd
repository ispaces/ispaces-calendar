echo %JAVA_HOME%
"%JAVA_HOME%\bin\java" ^
-cp ".;%JAVA_HOME%\lib\tools.jar;..\build\exploded\WEB-INF\lib\*;..\build\exploded\WEB-INF\classes"^
 com.ispaces.jetty.JettyServer .
