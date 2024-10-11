package comm.gis.gdm.module.system.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_sys_privilege")
public class PrivilegeInfoEntity {

    @ApiModelProperty("权限ID")
    private Long id;

    @ApiModelProperty("权限名称")
    @TableField(value = "name")
    private String name;

    @ApiModelProperty("权限代码")
    @TableField(value = "code")
    private String code;

    @ApiModelProperty("备注")
    @TableField(value = "memo")
    private String memo;

    @ApiModelProperty("模块ID")
    @TableField(value = "module_id")
    private Integer moduleId;

    @ApiModelProperty("排序编号")
    @TableField(value = "ordernumber")
    private Integer orderNumber;

    @ApiModelProperty("是否有效")
    private Integer valid;
}
