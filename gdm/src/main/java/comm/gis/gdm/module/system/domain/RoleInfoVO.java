package comm.gis.gdm.module.system.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class RoleInfoVO {

    @ApiModelProperty("用户账户")
    private String userId;

    @ApiModelProperty("角色名称")
    private String name;

    @ApiModelProperty("是否有效")
    private Integer valid;
}
