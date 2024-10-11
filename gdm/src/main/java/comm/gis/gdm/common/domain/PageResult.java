package comm.gis.gdm.common.domain;

import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PageResult<T> {

    @ApiModelProperty("当前页数")
    private int pageNum;

    @ApiModelProperty("每页行数")
    private int pageSize;

    @ApiModelProperty("开始行")
    private int startRow;

    @ApiModelProperty("结束行")
    private int endRow;

    @ApiModelProperty("总条数")
    private long total;

    @ApiModelProperty("总页数")
    private int pages;

    @ApiModelProperty("当前页列表")
    private List<T> list;
}
