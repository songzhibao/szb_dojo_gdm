package comm.gis.gdm.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.apache.commons.collections4.CollectionUtils;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired(required = false)
    private List<HandlerInterceptor> interceptorList;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        if (CollectionUtils.isEmpty(interceptorList)) {
            return;
        }
        interceptorList.forEach(e -> {
            registry.addInterceptor(e).addPathPatterns("/**");
        });
        // 配置swagger拦截器
        // registry.addInterceptor(new MyInterceptor())
        // .addPathPatterns("/**")
        // .excludePathPatterns("/swagger-resources/**", "/webjars/**",
        // "/swagger-ui/**", "/v3/**");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置swagger静态资源映射
        registry.addResourceHandler("/swagger-ui/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/springfox-swagger-ui/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 跨域支持
        registry.addMapping("/**").allowedOriginPatterns("*").allowedMethods("*").allowCredentials(true);
    }
}
