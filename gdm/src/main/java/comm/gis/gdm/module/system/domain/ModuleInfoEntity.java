package comm.gis.gdm.module.system.domain;

import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_sys_module")
public class ModuleInfoEntity {

    @ApiModelProperty("模块ID")
    private Long id;

    @ApiModelProperty("模块名称")
    @TableField(value = "name")
    private String name;

    @ApiModelProperty("模块代码")
    @TableField(value = "code")
    private String code;

    @ApiModelProperty("排序编号")
    @TableField(value = "ordernumber")
    private Integer orderNumber;

    @ApiModelProperty("权限列表")
    @TableField(exist = false)
    private List<PrivilegeInfoEntity> children;
}
