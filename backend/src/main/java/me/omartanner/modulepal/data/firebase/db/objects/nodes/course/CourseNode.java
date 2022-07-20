package me.omartanner.modulepal.data.firebase.db.objects.nodes.course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.omartanner.modulepal.data.firebase.db.Decodable;
import me.omartanner.modulepal.data.firebase.db.Encodable;
import me.omartanner.modulepal.helper.base64.Base64;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseNode implements Encodable, Decodable {
    private Map<String, Map<String, Course>> courseData; // moduleCode -> academicYear -> Course

    @Override
    public void decode() {
        Map<String, Map<String, Course>> newCourseData = new HashMap<>(courseData.size());
        courseData.forEach((moduleCode, academicYearCourse) -> {
            newCourseData.put(Base64.decode(moduleCode), Base64.decodeStringMap(academicYearCourse, true));
        });
        courseData = newCourseData;
    }

    @Override
    public void encode() {
        Map<String, Map<String, Course>> newCourseData = new HashMap<>(courseData.size());
        courseData.forEach((moduleCode, academicYearCourse) -> {
            newCourseData.put(Base64.encode(moduleCode), Base64.encodeStringMap(academicYearCourse, true));
        });
        courseData = newCourseData;
    }
}
