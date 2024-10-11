package comm.gis.gdm.common.domain;

import lombok.Data;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import org.apache.commons.lang3.StringUtils;

import comm.gis.gdm.common.code.ErrorCode;
import comm.gis.gdm.common.code.UserErrorCode;

/**
 * 请求返回对象
 */
@Data
@ApiModel("API请求返回对象")
public class ResponseResult<T> {

    public static final int OK_CODE = 0;

    public static final String OK_MSG = "success";
    /**
     * 标识代码，0表示成功，非0表示出错
     */
    @ApiModelProperty("标识代码,0表示成功,非0表示出错")
    private Integer code;
    /**
     * 信息级别
     */
    @ApiModelProperty("信息级别")
    private String level;
    /**
     * 描述信息，通常错时使用
     */
    @ApiModelProperty("错误描述")
    private String msg;
    /**
     * 返回是否成功
     */
    @ApiModelProperty("返回是否成功")
    private Boolean ok;
    /**
     * 业务数据
     */
    @ApiModelProperty("业务数据")
    private T data;

    public ResponseResult(Integer code, String level, boolean ok, String msg, T data) {
        this.code = code;
        this.level = level;
        this.ok = ok;
        this.msg = msg;
        this.data = data;
    }

    public ResponseResult(ErrorCode errorCode, boolean ok, String msg, T data) {
        this.code = errorCode.getCode();
        this.level = errorCode.getLevel();
        this.ok = ok;
        if (StringUtils.isNotBlank(msg)) {
            this.msg = msg;
        } else {
            this.msg = errorCode.getMsg();
        }
        this.data = data;
    }

    public static <T> ResponseResult<T> ok() {
        return new ResponseResult<>(OK_CODE, null, true, OK_MSG, null);
    }

    public static <T> ResponseResult<T> ok(T data) {
        return new ResponseResult<>(OK_CODE, null, true, OK_MSG, data);
    }

    public static <T> ResponseResult<T> okMsg(String msg) {
        return new ResponseResult<>(OK_CODE, null, true, msg, null);
    }

    // -------------------------------------------- 最常用的 用户参数 错误码
    // --------------------------------------------

    public static <T> ResponseResult<T> userErrorParam() {
        return new ResponseResult<>(UserErrorCode.PARAM_ERROR, false, null, null);
    }

    public static <T> ResponseResult<T> userErrorParam(String msg) {
        return new ResponseResult<>(UserErrorCode.PARAM_ERROR, false, msg, null);
    }

    // -------------------------------------------- 错误码
    // --------------------------------------------

    public static <T> ResponseResult<T> error(ErrorCode errorCode) {
        return new ResponseResult<>(errorCode, false, null, null);
    }

    public static <T> ResponseResult<T> error(ErrorCode errorCode, boolean ok) {
        return new ResponseResult<>(errorCode, ok, null, null);
    }

    public static <T> ResponseResult<T> error(ErrorCode errorCode, String msg) {
        return new ResponseResult<>(errorCode, false, msg, null);
    }

    public static <T> ResponseResult<T> errorData(ErrorCode errorCode, T data) {
        return new ResponseResult<>(errorCode, false, null, data);
    }

}
