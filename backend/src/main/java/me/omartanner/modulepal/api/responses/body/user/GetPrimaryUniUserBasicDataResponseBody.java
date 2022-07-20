package me.omartanner.modulepal.api.responses.body.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.omartanner.modulepal.api.dto.UniUserBasicData;

@Data
@AllArgsConstructor
public class GetPrimaryUniUserBasicDataResponseBody {
    private UniUserBasicData uniUserBasicData;
}
