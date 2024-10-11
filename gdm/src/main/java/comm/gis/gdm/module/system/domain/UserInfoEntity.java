package comm.gis.gdm.module.system.domain;

import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_sys_user")
public class UserInfoEntity {

    @ApiModelProperty("用户ID")
    private Long id;

    @ApiModelProperty("用户昵称")
    @TableField(value = "name")
    private String name;

    @ApiModelProperty("用户账户")
    @TableField(value = "code")
    private String code;

    @ApiModelProperty("用户密码")
    @TableField(value = "password")
    private String password;

    @ApiModelProperty("人员电话")
    @TableField(value = "phone")
    private String phone;

    @ApiModelProperty("人员照片")
    @TableField(value = "photo")
    private String photo;

    @ApiModelProperty("单位编号")
    @TableField(value = "org_id")
    private String orgId;

    @ApiModelProperty("备注")
    @TableField(value = "memo")
    private String memo;

    @ApiModelProperty("是否有效")
    private Integer valid;

    @ApiModelProperty("角色名称")
    @TableField(exist = false)
    private String roleName;

    @ApiModelProperty("用户单位信息")
    @TableField(exist = false)
    private OrgInfoEntity orgInfo;

    @ApiModelProperty("角色ID列表")
    @TableField(exist = false)
    private List<Long> roleIds;

    @ApiModelProperty("权限ID列表")
    @TableField(exist = false)
    private List<Long> privilegeIds;
}
