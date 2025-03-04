import {Fragment} from 'react';
import styled from '@emotion/styled';

import {Alert} from 'sentry/components/alert';
import ExternalLink from 'sentry/components/links/externalLink';
import {Layout, LayoutProps} from 'sentry/components/onboarding/gettingStartedDoc/layout';
import {ModuleProps} from 'sentry/components/onboarding/gettingStartedDoc/sdkDocumentation';
import {StepType} from 'sentry/components/onboarding/gettingStartedDoc/step';
import {t, tct} from 'sentry/locale';

// Configuration Start
export const steps = ({
  dsn,
}: Partial<Pick<ModuleProps, 'dsn'>> = {}): LayoutProps['steps'] => [
  {
    type: StepType.INSTALL,
    description: (
      <p>
        {tct('Install our Go Iris SDK using [code:go get]:', {
          code: <code />,
        })}
      </p>
    ),
    configurations: [
      {
        language: 'bash',
        code: 'go get github.com/getsentry/sentry-go/iris',
      },
    ],
  },
  {
    type: StepType.CONFIGURE,
    description: t(
      "Import and initialize the Sentry SDK early in your application's setup:"
    ),
    configurations: [
      {
        language: 'go',
        code: `
import (
  "fmt"

  "github.com/getsentry/sentry-go"
  sentryiris "github.com/getsentry/sentry-go/iris"
  "github.com/kataras/iris/v12"
)

// To initialize Sentry's handler, you need to initialize Sentry itself beforehand
if err := sentry.Init(sentry.ClientOptions{
  Dsn: "${dsn}",
  EnableTracing: true,
  // Set TracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production,
  TracesSampleRate: 1.0,
}); err != nil {
  fmt.Printf("Sentry initialization failed: %v\n", err)
}

// Then create your app
app := iris.Default()

// Once it's done, you can attach the handler as one of your middleware
app.Use(sentryiris.New(sentryiris.Options{}))

// Set up routes
app.Get("/", func(ctx iris.Context) {
  ctx.Writef("Hello world!")
})

// And run it
app.Run(iris.Addr(":3000"))
        `,
      },
      {
        description: (
          <Fragment>
            <strong>{t('Options')}</strong>
            <p>
              {tct(
                '[sentryirisCode:sentryiris] accepts a struct of [optionsCode:Options] that allows you to configure how the handler will behave.',
                {sentryirisCode: <code />, optionsCode: <code />}
              )}
            </p>
            {t('Currently it respects 3 options:')}
          </Fragment>
        ),
        language: 'go',
        code: `
// Whether Sentry should repanic after recovery, in most cases it should be set to true,
// as iris.Default includes its own Recovery middleware what handles http responses.
Repanic bool
// Whether you want to block the request before moving forward with the response.
// Because Iris's default "Recovery" handler doesn't restart the application,
// it's safe to either skip this option or set it to "false".
WaitForDelivery bool
// Timeout for the event delivery requests.
Timeout time.Duration
        `,
      },
    ],
  },
  {
    title: t('Usage'),
    description: (
      <Fragment>
        <p>
          {tct(
            "[sentryirisCode:sentryiris] attaches an instance of [sentryHubLink:*sentry.Hub] to the [irisContextCode:iris.Context], which makes it available throughout the rest of the request's lifetime. You can access it by using the [getHubFromContextCode:sentryiris.GetHubFromContext()] method on the context itself in any of your proceeding middleware and routes. And it should be used instead of the global [captureMessageCode:sentry.CaptureMessage], [captureExceptionCode:sentry.CaptureException], or any other calls, as it keeps the separation of data between the requests.",
            {
              sentryirisCode: <code />,
              sentryHubLink: (
                <ExternalLink href="https://godoc.org/github.com/getsentry/sentry-go#Hub" />
              ),
              irisContextCode: <code />,
              getHubFromContextCode: <code />,
              captureMessageCode: <code />,
              captureExceptionCode: <code />,
            }
          )}
        </p>
        <AlertWithoutMarginBottom>
          {tct(
            "Keep in mind that [sentryHubCode:*sentry.Hub] won't be available in middleware attached before [sentryirisCode:sentryiris]!",
            {sentryirisCode: <code />, sentryHubCode: <code />}
          )}
        </AlertWithoutMarginBottom>
      </Fragment>
    ),
    configurations: [
      {
        language: 'go',
        code: `
app := iris.Default()

app.Use(sentryiris.New(sentryiris.Options{
  Repanic: true,
}))

app.Use(func(ctx iris.Context) {
  if hub := sentryiris.GetHubFromContext(ctx); hub != nil {
    hub.Scope().SetTag("someRandomTag", "maybeYouNeedIt")
  }
  ctx.Next()
})

app.Get("/", func(ctx iris.Context) {
  if hub := sentryiris.GetHubFromContext(ctx); hub != nil {
    hub.WithScope(func(scope *sentry.Scope) {
      scope.SetExtra("unwantedQuery", "someQueryDataMaybe")
      hub.CaptureMessage("User provided unwanted query string, but we recovered just fine")
    })
  }
})

app.Get("/foo", func(ctx iris.Context) {
  // sentryiris handler will catch it just fine. Also, because we attached "someRandomTag"
  // in the middleware before, it will be sent through as well
  panic("y tho")
})

app.Run(iris.Addr(":3000"))
        `,
      },
      {
        description: (
          <strong>
            {tct('Accessing Request in [beforeSendCode:BeforeSend] callback', {
              beforeSendCode: <code />,
            })}
          </strong>
        ),
        language: 'go',
        code: `
sentry.Init(sentry.ClientOptions{
  Dsn: "${dsn}",
  BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
    if hint.Context != nil {
      if req, ok := hint.Context.Value(sentry.RequestContextKey).(*http.Request); ok {
        // You have access to the original Request here
      }
    }

    return event
  },
})
        `,
      },
    ],
  },
];
// Configuration End

export function GettingStartedWithIris({dsn, ...props}: ModuleProps) {
  return <Layout steps={steps({dsn})} {...props} />;
}

export default GettingStartedWithIris;

const AlertWithoutMarginBottom = styled(Alert)`
  margin-bottom: 0;
`;
