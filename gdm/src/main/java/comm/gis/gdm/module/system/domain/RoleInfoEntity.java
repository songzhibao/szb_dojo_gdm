package comm.gis.gdm.module.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_sys_role")
public class RoleInfoEntity {

    @ApiModelProperty("用户ID")
    private Long id;

    @ApiModelProperty("角色名称")
    @TableField(value = "name")
    private String name;

    @ApiModelProperty("用户账户")
    @TableField(value = "code")
    private String code;

    @ApiModelProperty("备注")
    @TableField(value = "memo")
    private String memo;

    @ApiModelProperty("是否有效")
    private Integer valid;
}
