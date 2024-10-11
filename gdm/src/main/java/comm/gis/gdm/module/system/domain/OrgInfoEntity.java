package comm.gis.gdm.module.system.domain;

import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_sys_organization")
public class OrgInfoEntity {

    @ApiModelProperty("机构id")
    private String id;

    @ApiModelProperty("单位类型ID")
    @TableField(value = "type_id")
    private Integer typeId;

    @ApiModelProperty("机构编号")
    @TableField(value = "code")
    private String code;

    @ApiModelProperty("机构名称")
    @TableField(value = "name")
    private String name;

    @ApiModelProperty("机构父编号")
    @TableField(value = "pid")
    private String parent;

    @ApiModelProperty("机构级别id")
    @TableField(value = "level")
    private String orgLevel;

    @ApiModelProperty("单位电话")
    @TableField(value = "telphone")
    private String tel;

    @ApiModelProperty("单位排序序号")
    @TableField(value = "order_number")
    private Integer OrderNumber;

    @ApiModelProperty("备注")
    @TableField(value = "memo")
    private String memo;

    @ApiModelProperty("是否有效")
    @TableField(value = "valid")
    private Integer valid = 1;

    @ApiModelProperty("单位类型")
    @TableField(exist = false)
    private String typeName;

    @ApiModelProperty("业务机构id")
    @TableField(exist = false)
    private String OrgId;

    @ApiModelProperty("是否勾选")
    @TableField(exist = false)
    private Boolean checked = true;

    @ApiModelProperty("用户级别")
    @TableField(exist = false)
    private Integer userLevel = 0;

    @ApiModelProperty("子机构列表")
    @TableField(exist = false)
    private List<OrgInfoEntity> children;
}
