import 'dart:convert';
import 'dart:io';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:http/http.dart' as http;

import 'package:camerawesome/camerawesome_plugin.dart';
import 'package:flutter/material.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  @override
  void initState() {
    super.initState();
  }

  Future<void> _showResult(String t) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Result'),
          content: SingleChildScrollView(child: Text(t)),
          actions: <Widget>[
            TextButton(
              child: const Text('Okay'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Image.asset(
                'assets/logo.png',
                height: 130,
              ),
            ),
            Expanded(
              child: CameraAwesomeBuilder.awesome(
                saveConfig: SaveConfig.photoAndVideo(),
                onMediaTap: (mediaCapture) async {
                  print(mediaCapture.captureRequest.path);

                  final path = mediaCapture.captureRequest.path;
                  final bytes = await File(path!).readAsBytes();
                  final base64image = base64Encode(bytes);

                  final response = await http.post(
                    Uri.parse('http://192.168.240.21:8080/upload'),
                    headers: {'Content-Type': 'application/json'},
                    body: jsonEncode({
                      'base64Image': base64image,
                      'fileName': 'uploaded_image.jpeg',
                    }),
                  );

                  print(response);

                  FlutterTts flutterTts = FlutterTts();
                  flutterTts.speak(response.body);

                  _showResult(response.body);
                  // OpenFile.open(mediaCapture.filePath);
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}
