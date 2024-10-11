package comm.gis.gdm.config;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping;

import com.github.xiaoymin.knife4j.spring.annotations.EnableKnife4j;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseBuilder;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.RequestParameter;
import springfox.documentation.service.Response;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.spring.web.plugins.WebFluxRequestHandlerProvider;
import springfox.documentation.spring.web.plugins.WebMvcRequestHandlerProvider;

/**
 * 根据SwaggerTagConst内部类动态生成Swagger group
 *
 */
@EnableKnife4j
@Configuration
public class SwaggerConfig {

    @Value("${swagger.enable}")
    boolean swagger2enable;

    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.OAS_30)
                .apiInfo(apiInfo())
                .enable(swagger2enable)
                .select()
                .apis(RequestHandlerSelectors.basePackage("comm.gis.gdm.module"))
                .paths(doFilteringRules())
                .build()
                .globalRequestParameters(getGlobalRequestParameters())
                .globalResponses(HttpMethod.GET, getGlobalResponseMessage())
                .globalResponses(HttpMethod.POST, getGlobalResponseMessage());
    }

    private Predicate<String> doFilteringRules() {
        return PathSelectors.any();
        // return PathSelectors.regex("/user");
        // return Predicates.not(PathSelectors.regex("/error.*"));
        // return or(regex("/hello.*"),
        // regex("/rest/adxSspFinanceManagement.*"));//success
        // return PathSelectors.or(PathSelectors.regex("/rest/pic/url/query"), //
        // 此处必须为完整的url，到方法级别
        // PathSelectors.regex("/rest/text/url/query/.*") // 部分url的正则是 .*
        // regex("/api/v1/pop/bms/audit/.*")
        // );
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("GDM Api Documentation")
                .contact(new Contact("zhou", "",
                        ""))
                .version("1.2.1")
                .build();
    }

    /**
     * 封装全局通用参数
     */
    private List<RequestParameter> getGlobalRequestParameters() {
        List<RequestParameter> parameters = new ArrayList<>();
        // parameters.add(new RequestParameterBuilder()
        // .name("uuid")
        // .description("设备uuid")
        // .required(true)
        // .in(ParameterType.QUERY)
        // .query(q -> q.model(m -> m.scalarModel(ScalarType.STRING)))
        // .required(false)
        // .build());
        return parameters;
    }

    /**
     * 封装通用响应信息
     */
    private List<Response> getGlobalResponseMessage() {
        List<Response> responseList = new ArrayList<>();
        responseList.add(new ResponseBuilder().code("404").description("未找到资源").build());
        return responseList;
    }

    @Bean
    public static BeanPostProcessor springfoxHandlerProviderBeanPostProcessor() {
        return new BeanPostProcessor() {

            @Override
            public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
                if (bean instanceof WebMvcRequestHandlerProvider || bean instanceof WebFluxRequestHandlerProvider) {
                    customizeSpringfoxHandlerMappings(getHandlerMappings(bean));
                }
                return bean;
            }

            private <T extends RequestMappingInfoHandlerMapping> void customizeSpringfoxHandlerMappings(
                    List<T> mappings) {
                List<T> copy = mappings.stream()
                        .filter(mapping -> mapping.getPatternParser() == null)
                        .collect(Collectors.toList());
                mappings.clear();
                mappings.addAll(copy);
            }

            @SuppressWarnings("unchecked")
            private List<RequestMappingInfoHandlerMapping> getHandlerMappings(Object bean) {
                try {
                    Field field = ReflectionUtils.findField(bean.getClass(), "handlerMappings");
                    field.setAccessible(true);
                    return (List<RequestMappingInfoHandlerMapping>) field.get(bean);
                } catch (IllegalArgumentException | IllegalAccessException e) {
                    throw new IllegalStateException(e);
                }
            }
        };
    }

}
