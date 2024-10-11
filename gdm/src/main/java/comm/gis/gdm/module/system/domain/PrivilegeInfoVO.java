package comm.gis.gdm.module.system.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PrivilegeInfoVO {

    @ApiModelProperty("用户ID")
    private String userId;

    @ApiModelProperty("角色ID")
    private String roleId;
    
}
