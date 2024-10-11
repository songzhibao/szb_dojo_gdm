package comm.gis.gdm.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.type.AnnotatedTypeMetadata;

import comm.gis.gdm.common.domain.SystemEnvironment;
import comm.gis.gdm.common.enumeration.SystemEnvironmentEnum;
import comm.gis.gdm.common.util.EnumUtil;

/**
 * 系统环境
 *
 */
// @Configuration
// public class SystemEnvironmentConfig implements Condition {

// @Value("${spring.profiles.active}")
// private String systemEnvironment;

// @Value("${project.name}")
// private String projectName;

// @Override
// public boolean matches(ConditionContext conditionContext,
// AnnotatedTypeMetadata annotatedTypeMetadata) {
// String property =
// conditionContext.getEnvironment().getProperty("spring.profiles.active");
// return StringUtils.isNotBlank(property) &&
// !SystemEnvironmentEnum.PROD.equalsValue(property);
// }

// @Bean
// public SystemEnvironment initEnvironment() {
// SystemEnvironmentEnum currentEnvironment =
// SmartEnumUtil.getEnumByValue(systemEnvironment,
// SystemEnvironmentEnum.class);
// if (currentEnvironment == null) {
// throw new ExceptionInInitializerError("无法获取当前环境！请在 application.yaml
// 配置参数：spring.profiles.active");
// }
// if (StringUtils.isBlank(projectName)) {
// throw new ExceptionInInitializerError("无法获取当前项目名称！请在 application.yaml
// 配置参数：project.name");
// }
// return new SystemEnvironment(currentEnvironment ==
// SystemEnvironmentEnum.PROD, projectName, currentEnvironment);
// }
// }
