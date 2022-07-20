package me.omartanner.modulepal.data.firebase.db;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.firebase.database.*;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import me.omartanner.modulepal.helper.base64.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Component
@Slf4j
public class FirebaseDbManager {
    private static final Gson GSON = new Gson();

    @Autowired
    private FirebaseDatabase firebaseDatabase;

    public String[] generateKeys(LinkedList<String> path, int amount) throws FirebaseDbException {
        CheckedCallable<String[]> callable = () -> {
            String[] keys = new String[amount];
            DatabaseReference ref = pathToRef(path);
            for (int i = 0; i < amount; i++) {
                keys[i] = ref.push().getKey();
            }
            return keys;
        };
        return runAndRethrow(callable);
    }

    public String generateKey(LinkedList<String> path) throws FirebaseDbException {
        return pathToRef(path).push().getKey();
    }

    public CompletableFuture<Void> writeObjectAsync(LinkedList<String> path, Object o) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Void>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<Void> completableFuture = new CompletableFuture<>();
            ApiFuture<Void> writeFuture = ref.setValueAsync(o);
            ApiFutures.addCallback(
                    writeFuture,
                    new ApiFutureCallback<Void>() {
                        @Override
                        public void onFailure(Throwable throwable) {
                            log.error("FIREBASE: Failed to write " + GSON.toJson(o) + " to " + path.toString(), throwable);
                            completableFuture.cancel(true);
                        }

                        @Override
                        public void onSuccess(Void unused) {
                            log.info("FIREBASE: WRITTEN " + GSON.toJson(o) + " to " + path.toString());
                            completableFuture.complete(null);
                        }
                    }
            );
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public void writeObject(LinkedList<String> path, Object o) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            DatabaseReference ref = pathToRef(path);
            ref.setValueAsync(o).get();
            log.info("FIREBASE: WRITTEN " + GSON.toJson(o) + " to " + path.toString());
        };
        runAndRethrow(runnable);
    }

    private <T extends Encodable> void write(LinkedList<String> path, T o, DatabaseReference.CompletionListener completionListener) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            o.encode();
            pathToRef(path).setValue(o, completionListener);
        };
        runAndRethrow(runnable);
    }

    public <T extends Encodable> void writeEncodable(LinkedList<String> path, T o) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            o.encode();
            writeObject(path, o);
        };
        runAndRethrow(runnable);
    }

    public <T extends Encodable> CompletableFuture<Void> writeEncodableAsync(LinkedList<String> path, T o) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Void>> callable = () -> {
            o.encode();
            return writeObjectAsync(path, o);
        };
        return runAndRethrow(callable);
    }


    public <T extends Encodable> void writeList(LinkedList<String> path, List<T> o) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            Base64.encodeList(o);
            writeObject(path, o);
        };
        runAndRethrow(runnable);
    }

    public <T extends Encodable> void writeStringMap(LinkedList<String> path, Map<String, T> o, boolean encodeKeys) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            Map<String, T> newMap = Base64.encodeStringMap(o, encodeKeys);
            writeObject(path, newMap);
        };
        runAndRethrow(runnable);
    }

    public <T extends Encodable> void writeStringListStringMap(LinkedList<String> path, Map<String, List<String>> o, boolean encodeKeys, boolean encodeValues) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            Map<String, List<String>> newMap = Base64.encodeStringListStringMap(o, encodeKeys, encodeValues);
            writeObject(path, newMap);
        };
        runAndRethrow(runnable);
    }

    public void writeString(LinkedList<String> path, String o, boolean encode) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            String encoded = encode ? Base64.encode(o) : o;
            writeObject(path, encoded);
        };
        runAndRethrow(runnable);
    }

    public CompletableFuture<Void> writeStringAsync(LinkedList<String> path, String o, boolean encode) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Void>> callable = () -> {
            String encoded = encode ? Base64.encode(o) : o;
            return writeObjectAsync(path, encoded);
        };
        return runAndRethrow(callable);
    }

    public void writeBoolean(LinkedList<String> path, Boolean o) throws FirebaseDbException {
        writeObject(path, o);
    }

    public void writeStringList(LinkedList<String> path, List<String> o, boolean encode) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            if (encode) Base64.encodeStringList(o);
            writeObject(path, o);
        };
        runAndRethrow(runnable);
    }

    public void writeStringStringMap(LinkedList<String> path, Map<String, String> o, boolean encodeKeys, boolean encodeValues) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            Map<String, String> newMap = Base64.encodeStringStringMap(o, encodeKeys, encodeValues);
            writeObject(path, newMap);
        };
        runAndRethrow(runnable);
    }

    public CompletableFuture<Void> clearAsync(LinkedList<String> path) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Void>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<Void> completableFuture = new CompletableFuture<>();
            ApiFuture<Void> clearFuture = ref.removeValueAsync();
            ApiFutures.addCallback(
                    clearFuture,
                    new ApiFutureCallback<Void>() {
                        @Override
                        public void onFailure(Throwable throwable) {
                            log.error("FIREBASE: Failed to clear " + path.toString(), throwable);
                            completableFuture.cancel(true);
                        }

                        @Override
                        public void onSuccess(Void unused) {
                            log.info("FIREBASE: CLEARED " + path.toString());
                            completableFuture.complete(null);
                        }
                    }
            );
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public void clear(LinkedList<String> path) throws FirebaseDbException {
        CheckedRunnable runnable = () -> {
            pathToRef(path).removeValueAsync().get();
            log.info("FIREBASE: CLEARED " + path.toString());
        };
        runAndRethrow(runnable);
    }



    private DatabaseReference pathToRef(LinkedList<String> path) throws FirebaseDbException {
        CheckedCallable<DatabaseReference> callable = () -> {
            DatabaseReference ref = firebaseDatabase.getReference();
            for (String component : path) {
                ref = ref.child(component);
            }
            return ref;
        };
        return runAndRethrow(callable);
    }

    public CompletableFuture<String> readAsyncString(LinkedList<String> path, boolean decode) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<String>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<String> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        String data = dataSnapshot.getValue(String.class);
                        String decodedData = data == null ? null : (decode ? Base64.decode(data) : data);
                        completableFuture.complete(decodedData);
                    } catch (Exception e) {
                        log.error("Failed to read String from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read String from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public CompletableFuture<Boolean> readAsyncBoolean(LinkedList<String> path) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Boolean>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        Boolean data = dataSnapshot.getValue(Boolean.class);
                        completableFuture.complete(data);
                    } catch (Exception e) {
                        log.error("Failed to read Boolean from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read Boolean from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public <T extends Decodable> CompletableFuture<T> readAsync(LinkedList<String> path, Class<T> clazz) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<T>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<T> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        T data = dataSnapshot.getValue(clazz);
                        if (data != null) data.decode();
                        completableFuture.complete(data);
                    } catch (Exception e) {
                        log.error("Failed to read Decodable from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read Decodable from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public <T extends Decodable> CompletableFuture<List<T>> readAsyncGenericList(LinkedList<String> path) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<List<T>>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<List<T>> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        GenericTypeIndicator<List<T>> genericTypeIndicator = new GenericTypeIndicator<List<T>>() {
                        };
                        List<T> data = dataSnapshot.getValue(genericTypeIndicator);
                        if (data != null) Base64.decodeList(data);
                        completableFuture.complete(data);
                    } catch (Exception e) {
                        log.error("Failed to read List<Decodable> from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read List<Decodable> from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public CompletableFuture<List<String>> readAsyncStringList(LinkedList<String> path, boolean decode) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<List<String>>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<List<String>> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        GenericTypeIndicator<List<String>> genericTypeIndicator = new GenericTypeIndicator<List<String>>() {
                        };
                        List<String> data = dataSnapshot.getValue(genericTypeIndicator);
                        if (data != null && decode) Base64.decodeStringList(data);
                        completableFuture.complete(data);
                    } catch (Exception e) {
                        log.error("Failed to read List<String> from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read List<String> from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public CompletableFuture<Map<String, String>> readAsyncStringStringMap(LinkedList<String> path, boolean decodeKeys, boolean decodeValues) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Map<String, String>>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<Map<String, String>> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        GenericTypeIndicator<Map<String, String>> genericTypeIndicator = new GenericTypeIndicator<Map<String, String>>() {
                        };
                        Map<String, String> data = dataSnapshot.getValue(genericTypeIndicator);
                        Map<String, String> newMap = data == null ? null : Base64.decodeStringStringMap(data, decodeKeys, decodeValues);
                        completableFuture.complete(newMap);
                    } catch (Exception e) {
                        log.error("Failed to read Map<String, String> from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read Map<String, String> from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public <T extends Decodable> CompletableFuture<Map<String, T>> readAsyncStringGenericMap(LinkedList<String> path, GenericTypeIndicator<Map<String, T>> genericTypeIndicator, boolean decodeKeys) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Map<String, T>>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<Map<String, T>> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        Map<String, T> data = dataSnapshot.getValue(genericTypeIndicator);
                        Map<String, T> newMap = data == null ? null : Base64.decodeStringMap(data, decodeKeys);
                        completableFuture.complete(newMap);
                    } catch (Exception e) {
                        log.error("Failed to read Map<String, Decodable> from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read Map<String, Decodable> from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public CompletableFuture<Map<String, List<String>>> readAsyncStringListStringMap(LinkedList<String> path, GenericTypeIndicator<Map<String, List<String>>> genericTypeIndicator, boolean decodeKeys, boolean decodeValues) throws FirebaseDbException {
        CheckedCallable<CompletableFuture<Map<String, List<String>>>> callable = () -> {
            DatabaseReference ref = pathToRef(path);
            CompletableFuture<Map<String, List<String>>> completableFuture = new CompletableFuture<>();
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    try {
                        Map<String, List<String>> data = dataSnapshot.getValue(genericTypeIndicator);
                        Map<String, List<String>> newMap = data == null ? null : Base64.decodeStringListStringMap(data, decodeKeys, decodeValues);
                        completableFuture.complete(newMap);
                    } catch (Exception e) {
                        log.error("Failed to read Map<String, List<String>> from Firebase at " + path.toString(), e);
                        completableFuture.cancel(true);
                    }

                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    log.error("Failed to read Map<String, List<String>> from Firebase at " + path.toString(), databaseError);
                    completableFuture.cancel(true);
                }
            });
            return completableFuture;
        };
        return runAndRethrow(callable);
    }

    public <T> T runAndRethrow(CheckedCallable<T> function) throws FirebaseDbException {
        try {
            return function.run();
        }
        catch (InterruptedException | ExecutionException | CancellationException e) {
            throw new FirebaseDbException("FIREBASE: Async issue with I/O to Realtime Database.", e);
        }
        catch (FirebaseDbException e) {
            throw new FirebaseDbException("FIREBASE: Nested async issue with I/O to Realtime Database.", e);
        }
        catch (Exception e) {
            throw new FirebaseDbException("FIREBASE: Unknown issue with I/O to Realtime Database.", e);
        }
    }

    public void runAndRethrow(CheckedRunnable function) throws FirebaseDbException {
        CheckedCallable<Object> callable = new CheckedCallable() {
            @Override
            public Object run() throws InterruptedException, ExecutionException, CancellationException, FirebaseDbException {
                function.run();
                return null;
            }
        };
        runAndRethrow(callable);
    }
}
