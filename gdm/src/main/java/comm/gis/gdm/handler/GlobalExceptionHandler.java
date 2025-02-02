package comm.gis.gdm.handler;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.TypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import comm.gis.gdm.common.code.SystemErrorCode;
import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.ResponseResult;
import comm.gis.gdm.common.exception.BusinessException;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 全局异常拦截
 *
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    // @Autowired
    // private SystemEnvironment systemEnvironment;

    /**
     * json 格式错误 缺少请求体
     */
    @ResponseBody
    @ExceptionHandler({ HttpMessageNotReadableException.class })
    public ResponseResult<?> jsonFormatExceptionHandler(Exception e) {
        // if (!systemEnvironment.isProd()) {
        log.error("全局JSON格式错误异常,URL:{}", getCurrentRequestUrl(), e);
        // }
        return ResponseResult.error(UserErrorCode.PARAM_ERROR, "参数JSON格式错误");
    }

    /**
     * json 格式错误 缺少请求体
     */
    @ResponseBody
    @ExceptionHandler({ TypeMismatchException.class, BindException.class })
    public ResponseResult<?> paramExceptionHandler(Exception e) {
        // if (!systemEnvironment.isProd()) {
        log.error("全局参数异常,URL:{}", getCurrentRequestUrl(), e);
        // }

        if (e instanceof BindException) {
            if (e instanceof MethodArgumentNotValidException) {
                List<FieldError> fieldErrors = ((MethodArgumentNotValidException) e).getBindingResult()
                        .getFieldErrors();
                List<String> msgList = fieldErrors.stream().map(FieldError::getDefaultMessage).collect(
                        Collectors.toList());
                return ResponseResult.error(UserErrorCode.PARAM_ERROR, String.join(",", msgList));
            }

            List<FieldError> fieldErrors = ((BindException) e).getFieldErrors();
            List<String> error = fieldErrors.stream().map(field -> field.getField() + ":" + field.getRejectedValue())
                    .collect(Collectors.toList());
            String errorMsg = UserErrorCode.PARAM_ERROR.getMsg() + ":" + error;

            return ResponseResult.error(UserErrorCode.PARAM_ERROR, errorMsg);
        }

        return ResponseResult.error(UserErrorCode.PARAM_ERROR);
    }

    /**
     * 业务异常
     */
    @ResponseBody
    @ExceptionHandler(BusinessException.class)
    public ResponseResult<?> businessExceptionHandler(BusinessException e) {
        // if (!systemEnvironment.isProd()) {
        log.error("全局业务异常,URL:{}", getCurrentRequestUrl(), e);
        // }
        return ResponseResult.error(SystemErrorCode.SYSTEM_ERROR, e.getMessage());
    }

    /**
     * 其他全部异常
     *
     * @param e
     * @return
     */
    @ResponseBody
    @ExceptionHandler(Throwable.class)
    public ResponseResult<?> errorHandler(Throwable e) {
        log.error("捕获全局异常,URL:{}", getCurrentRequestUrl(), e);
        return ResponseResult.error(SystemErrorCode.SYSTEM_ERROR, e.toString());
    }

    /**
     * 获取当前请求url
     */
    private String getCurrentRequestUrl() {
        RequestAttributes request = RequestContextHolder.getRequestAttributes();
        if (null == request) {
            return null;
        }
        ServletRequestAttributes servletRequest = (ServletRequestAttributes) request;
        return servletRequest.getRequest().getRequestURI();
    }

}
