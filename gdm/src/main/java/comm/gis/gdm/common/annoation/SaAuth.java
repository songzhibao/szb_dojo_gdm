package comm.gis.gdm.common.annoation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 校验权限注解
 *
 * @Author songzhibao
 * @Date 2023-02-01 13:22:12
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface SaAuth {

    String saAuth = "saAuth";
}
