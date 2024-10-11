package comm.gis.gdm.module.system.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.*;

@Data
public class UserInfoVO {

    @ApiModelProperty("用户账户")
    private String code;

    @ApiModelProperty("用户名称")
    private String name;

    @ApiModelProperty("单位ID")
    private List<String> orgIds;

    @ApiModelProperty("手机号码")
    private String phone;

    @ApiModelProperty("人员号码")
    private String policeNumber;

    @ApiModelProperty("人员类型")
    private String policeType;

    @ApiModelProperty("角色ID")
    private Integer roleId;

    @ApiModelProperty("是否有效")
    private Integer valid;
}
