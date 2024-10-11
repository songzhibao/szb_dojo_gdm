package comm.gis.gdm.module.alarm.service;

import java.util.*;
import comm.gis.gdm.module.alarm.domain.*;

public interface AlarmService {

        /*
         * 获取视频列表
         */
        List<VideoInfoEntity> getVideoList(AlarmVO queryVO);
}
