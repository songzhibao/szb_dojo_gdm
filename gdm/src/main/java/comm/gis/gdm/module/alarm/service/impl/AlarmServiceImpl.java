package comm.gis.gdm.module.alarm.service.impl;

import comm.gis.gdm.mapper.VideoInfoMapper;
import comm.gis.gdm.module.alarm.domain.AlarmVO;
import comm.gis.gdm.module.alarm.domain.VideoInfoEntity;
import comm.gis.gdm.module.alarm.service.AlarmService;
import comm.gis.gdm.util.SqlUtils;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlarmServiceImpl implements AlarmService {

    @Autowired
    private VideoInfoMapper videoDao;

    @Override
    public List<VideoInfoEntity> getVideoList(AlarmVO queryVO) {
        String partSql = SqlUtils.getOrgFilter("org_id", queryVO.getOrgCodes());
        partSql += SqlUtils.getGisQueryPartSql("gdm_video_device", queryVO.getGisQueryType(),
                queryVO.getGisQueryValue());

        List<VideoInfoEntity> list = this.videoDao.getVideoInfoBySql(partSql);
        if (list != null) {
            for (VideoInfoEntity bean : list) {

            }
        }
        return list;
    }
}
