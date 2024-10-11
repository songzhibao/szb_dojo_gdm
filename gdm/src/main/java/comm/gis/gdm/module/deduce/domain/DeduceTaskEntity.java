package comm.gis.gdm.module.deduce.domain;

import java.sql.Timestamp;
import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_deduce_task")
public class DeduceTaskEntity {

    @ApiModelProperty("ID")
    private String id;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("类型")
    private String type;

    @ApiModelProperty("状态")
    private Integer status;

    @ApiModelProperty("是否启用")
    private Integer isUsed;

    @ApiModelProperty("是否删除")
    private Integer isDeleted;

    @ApiModelProperty(value = "创建时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Timestamp beginTime;

    @ApiModelProperty(value = "创建时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Timestamp endTime;

    @ApiModelProperty("方案元素")
    @TableField(exist = false)
    private List<JSONObject> PlanItems;
}
