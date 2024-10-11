package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.*;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

@Data
@TableName("gdm_sys_call_group")
public class CallGroupEntity {

    @ApiModelProperty("ID")
    private String id;

    @ApiModelProperty("排序编号")
    private String orderNum;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("所有者ID")
    private Integer operator;

    @ApiModelProperty("所有者单位编号")
    private Integer operatorOrg;

    @ApiModelProperty("是否有效")
    private Integer valid;

    @ApiModelProperty("成员信息")
    @TableField(exist = false)
    private List<CallGroupMemberEntity> memberList;

    @ApiModelProperty("警力信息")
    @TableField(exist = false)
    private List<PoliceInfoEntity> policeList;
}
