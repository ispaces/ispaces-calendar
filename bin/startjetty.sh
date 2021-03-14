echo $JAVA_HOME
"$JAVA_HOME/bin/java" \
-cp ".:../build/exploded/WEB-INF/lib/*:../build/exploded/WEB-INF/classes" \
com.ispaces.jetty.JettyServer .
