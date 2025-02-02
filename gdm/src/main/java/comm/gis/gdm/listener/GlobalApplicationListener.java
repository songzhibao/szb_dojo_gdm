package comm.gis.gdm.listener;

import cn.hutool.core.net.NetUtil;
import cn.hutool.core.util.URLUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.context.WebServerApplicationContext;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.boot.web.server.WebServer;
import org.springframework.context.ApplicationListener;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * 启动监听器
 *
 */
@Slf4j
@Component
@Order(value = 1024)
public class GlobalApplicationListener implements ApplicationListener<WebServerInitializedEvent> {

    @Override
    public void onApplicationEvent(WebServerInitializedEvent webServerInitializedEvent) {
        WebServer server = webServerInitializedEvent.getWebServer();
        WebServerApplicationContext context = webServerInitializedEvent.getApplicationContext();
        Environment env = context.getEnvironment();
        // 获取服务信息
        String ip = NetUtil.getLocalhost().getHostAddress();
        Integer port = server.getPort();
        String contextPath = env.getProperty("server.servlet.context-path");
        if (contextPath == null) {
            contextPath = "";
        }
        // 拼接服务地址
        String title = "-------------【 service is running  】-------------";
        String localhostUrl = URLUtil.normalize(String.format("http://localhost:%d%s/druid", port, contextPath), false,
                true);
        String externalUrl = URLUtil.normalize(String.format("http://%s:%d%s", ip, port, contextPath), false, true);

        // "http://localhost:%d%s/swagger-ui/index.html"
        String swaggerUrl = URLUtil.normalize(
                String.format("http://localhost:%d%s/doc.html", port, contextPath),
                false, true);
        log.info("\n{}\n" +
                "\tExternal:\t{}" +
                "\n\tDruid:\t\t{}" +
                "\n\tSwagger:\t{}" +
                "\n-------------------------------------------------------------------------------------\n",
                title, externalUrl, localhostUrl, swaggerUrl);
    }
}